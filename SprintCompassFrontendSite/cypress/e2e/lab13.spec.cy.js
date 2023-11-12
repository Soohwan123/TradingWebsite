describe("Test Lab 13 - Load and find User From Autocomplete", () => {
    it("finds the server and builds a sentence", () => {
      cy.visit("http://localhost:5173/");
      cy.get("#menubtn").click();
      cy.contains("a", "Lab 13").click();
      cy.contains("Lab 13");
      cy.wait(5000);  
      cy.get("#users").click().type("{s}"); 
      cy.get("#users").click().type("{o}"); 
      cy.get("#users").click().type("{downArrow}{enter}"); 

      cy.contains('You selected Soohwan Kim post. This user can be contacted at sk2@here.com');
    });
});