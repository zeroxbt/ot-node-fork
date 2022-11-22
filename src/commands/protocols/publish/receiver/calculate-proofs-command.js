import EpochCommand from '../../common/epoch-command';

class CalculateProofsCommand extends EpochCommand {
    constructor(ctx) {
        super(ctx);
        this.commandExecutor = ctx.commandExecutor;
        this.validationModuleManager = ctx.validationModuleManager;
        this.blockchainModuleManager = ctx.blockchainModuleManager;
        this.tripleStoreModuleManager = ctx.tripleStoreModuleManager;
        this.serviceAgreementService = ctx.serviceAgreementService;
    }

    async execute(command) {
        const {
            blockchain,
            contract,
            tokenId,
            keyword,
            hashFunctionId,
            serviceAgreement,
            epoch,
            agreementId,
            identityId,
            proofWindowStartTime,
        } = command.data;

        this.logger.trace(
            `Started ${command.name} for agreement id: ${agreementId} ` +
                `contract: ${contract}, token id: ${tokenId}, keyword: ${keyword}, ` +
                `hash function id: ${hashFunctionId}`,
        );

        if (!(await this.isEligibleForRewards(blockchain, agreementId, epoch, identityId))) {
            this.logger.trace('Scheduling next epoch check...');

            await this.scheduleNextEpochCheck(
                blockchain,
                agreementId,
                contract,
                tokenId,
                keyword,
                epoch,
                hashFunctionId,
                serviceAgreement,
            );

            return command.empty();
        }

        this.logger.trace(`Calculating proofs for agreement id : ${agreementId}`);
        const { assertionId, challenge } = await this.blockchainModuleManager.getChallenge(
            blockchain,
            contract,
            tokenId,
            epoch,
        );

        const nQuads = (await this.tripleStoreModuleManager.get(assertionId))
            .split('\n')
            .filter(Boolean);

        const { leaf, proof } = this.validationModuleManager.getMerkleProof(nQuads, challenge);

        const proofWindowDurationPerc =
            await this.blockchainModuleManager.getProofWindowDurationPerc();
        const proofWindowDuration = Math.floor(
            (serviceAgreement.epochLength * proofWindowDurationPerc) / 100,
        );

        const endOffset = 30; // 30 sec

        const timeNow = Math.floor(Date.now() / 1000);
        const delay = this.serviceAgreementService.randomIntFromInterval(
            proofWindowStartTime - timeNow,
            proofWindowStartTime + proofWindowDuration - timeNow - endOffset,
        );

        await this.commandExecutor.add({
            name: 'submitProofsCommand',
            sequence: [],
            delay,
            data: {
                ...command.data,
                leaf,
                proof,
            },
            retries: 3,
            transactional: false,
        });

        return command.empty();
    }

    async isEligibleForRewards(blockchain, agreementId, epoch, identityId) {
        const r0 = await this.blockchainModuleManager.getR0(blockchain);

        const commits = await this.blockchainModuleManager.getCommitSubmissions(
            blockchain,
            agreementId,
            epoch,
        );

        for (let i = 0; i < r0; i += 1) {
            if (commits[i].identityId === identityId) {
                this.logger.trace(`Node is eligible for rewards for agreement id: ${agreementId}`);

                return true;
            }
        }

        this.logger.trace(`Node is not eligible for rewards for agreement id: ${agreementId}`);

        return false;
    }

    /**
     * Builds default calculateProofsCommand
     * @param map
     * @returns {{add, data: *, delay: *, deadline: *}}
     */
    default(map) {
        const command = {
            name: 'calculateProofsCommand',
            delay: 0,
            transactional: false,
        };
        Object.assign(command, map);
        return command;
    }
}

export default CalculateProofsCommand;
