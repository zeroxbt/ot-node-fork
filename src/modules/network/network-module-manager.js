import BaseModuleManager from '../base-module-manager.js';

class NetworkModuleManager extends BaseModuleManager {
    getName() {
        return 'network';
    }

    async start() {
        if (this.initialized) {
            return this.getImplementation().module.start();
        }
    }

    async onPeerConnected(listener) {
        if (this.initialized) {
            return this.getImplementation().module.onPeerConnected(listener);
        }
    }

    getMultiaddrs() {
        if (this.initialized) {
            return this.getImplementation().module.getMultiaddrs();
        }
    }

    async sendMessage(
        protocol,
        peerIdString,
        messageType,
        operationId,
        keywordUuid,
        message,
        timeout,
    ) {
        if (this.initialized) {
            return this.getImplementation().module.sendMessage(
                protocol,
                peerIdString,
                messageType,
                operationId,
                keywordUuid,
                message,
                timeout,
            );
        }
    }

    async sendMessageResponse(protocol, peerIdString, messageType, operationId, keyword, message) {
        if (this.initialized) {
            return this.getImplementation().module.sendMessageResponse(
                protocol,
                peerIdString,
                messageType,
                operationId,
                keyword,
                message,
            );
        }
    }

    handleMessage(protocol, handler, options) {
        if (this.initialized) {
            this.getImplementation().module.handleMessage(protocol, handler, options);
        }
    }

    getPeerId() {
        if (this.initialized) {
            return this.getImplementation().module.getPeerId();
        }
    }

    getPeerIdString() {
        if (this.initialized) {
            return this.getImplementation().module.getPeerIdString();
        }
    }

    async healthCheck() {
        if (this.initialized) {
            return this.getImplementation().module.healthCheck();
        }
    }

    async findPeer(peerIdString) {
        if (this.initialized) {
            return this.getImplementation().module.findPeer(peerIdString);
        }
    }

    async dial(peerIdString) {
        if (this.initialized) {
            return this.getImplementation().module.dial(peerIdString);
        }
    }

    async getPeerInfo(peerIdString) {
        if (this.initialized) {
            return this.getImplementation().module.getPeerInfo(peerIdString);
        }
    }

    async removeCachedSession(operationId, keywordUuid, peerIdString) {
        if (this.initialized) {
            await this.getImplementation().module.removeCachedSession(
                operationId,
                keywordUuid,
                peerIdString,
            );
        }
    }
}

export default NetworkModuleManager;
