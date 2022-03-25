Feature: Release related tests
  Background: Setup local blockchain, bootstraps and nodes
    Given the blockchain is set up
    And 1 bootstrap is running

  Scenario: Get info route returns expected version
    Given I setup 1 node
    When I call info route on node 1
    Then The node version should start with number 6

  Scenario: Publish returns expected result
    Given I setup 4 nodes
    When I call publish on node 1 with keywords:
    | "keyword 1" | "keyword 2" |
    Then The returned handler_id is a valid uuid
