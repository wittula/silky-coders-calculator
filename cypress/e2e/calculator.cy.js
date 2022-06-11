describe("Calculator app", () => {
  it("Should calculate temperature by input", () => {
    cy.visit("http://localhost:8080");
    cy.get('input[id="value"]').should("be.visible").type("15");
    cy.get('select[id="tempFrom"]').should("be.visible").select("c");
    cy.get('select[id="tempTo"]').should("be.visible").select("k");
    cy.get("button[type=submit]").should("be.visible").click();

    cy.get('div[id="errorDiv"]').should("have.class", "visuallyhidden");
  });

  it("Should show error when input = MIN_VALUE", () => {
    cy.get('input[id="value"]').clear().type(Number.MIN_VALUE);
    cy.get("button[type=submit]").should("be.visible").click();

    cy.get('div[id="errorDiv"]').should("not.have.class", "visuallyhidden");
  });

  it("Should show error when input = MAX_VALUE", () => {
    cy.get('input[id="value"]').clear().type(Number.MIN_VALUE);
    cy.get("button[type=submit]").should("be.visible").click();

    cy.get('div[id="errorDiv"]').should("not.have.class", "visuallyhidden");
  });

  it("Should show error when input = MIN_SAFE_INTEGER", () => {
    cy.get('input[id="value"]').clear().type(Number.MIN_SAFE_INTEGER);
    cy.get("button[type=submit]").should("be.visible").click();

    cy.get('div[id="errorDiv"]').should("not.have.class", "visuallyhidden");
  });

  it("Should show error when input = MAX_SAFE_INTEGER", () => {
    cy.get('input[id="value"]').clear().type(Number.MAX_SAFE_INTEGER);
    cy.get("button[type=submit]").should("be.visible").click();

    cy.get('div[id="errorDiv"]').should("not.have.class", "visuallyhidden");
  });

  it("Should show error when both temperatures units are the same", () => {
    cy.get('select[id="tempFrom"]').should("be.visible").select("c");
    cy.get('select[id="tempTo"]').should("be.visible").select("c");
    cy.get("button[type=submit]").should("be.visible").click();

    cy.get('div[id="errorDiv"]').should("not.have.class", "visuallyhidden");
  });
});
