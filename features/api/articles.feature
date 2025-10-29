Feature: Articles management

  Background:
    Given a registered user with a valid token

  Scenario: Create a new article successfully
    When I create a new article
    Then the API should respond with status 201
    And the response should include an article slug

  Scenario: Fetch the created article by slug
    When I request the article by slug
    Then the API should return the article with the correct title

  Scenario: Update the article successfully
    When I update the article title and description
    Then the API should return the updated article with status 200

  Scenario: Delete the article successfully
    When I delete the article
    Then the API should return status 204

  Scenario: Fetch deleted article
    When I request the deleted article
    Then the API should return status 404
