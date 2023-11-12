describe("Test Sentence Builder using Autocomplete", () => {
    it("finds the server and builds a sentence", () => {
      cy.visit("http://localhost:5173/");
      cy.get("#words").click().type("{downArrow}{enter}");
      cy.get("#words").click().type("{downArrow}{enter}");
      cy.get("#words").click().type("{downArrow}{enter}");
      cy.get("#words").click().type("{downArrow}{enter}");
      cy.get("#words").click().type("{downArrow}{enter}");
      cy.get("#words").click().type("{downArrow}{enter}");
  
      cy.get('h6').contains('Hey I built a sentence. Soohwan Kim');
    });
  });
