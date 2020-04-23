describe('Opportunities', () => {
  before(() => {
    cy.setupRegion('scratch')
  })

  beforeEach(() => {
    cy.fixture('regions/scratch.json').as('region')
    cy.findByTitle(/Opportunity datasets/i).click({force: true})
    cy.location('pathname').should('match', /\/opportunities$/)
  })

  it('can be uploaded as CSV', function () {
    let oppName = 'opp ' + Date.now()
    cy.findByText(/Upload a new dataset/i).click()
    cy.location('pathname').should('match', /\/opportunities\/upload$/)
    cy.findByPlaceholderText(/^Opportunity dataset/i).type(oppName)
    cy.fixture(this.region.opportunityCSV).then((fileContent) => {
      cy.findByLabelText(/^Select opportunity dataset/i).upload({
        fileContent,
        fileName: this.region.opportunityCSV,
        mimeType: 'text/csv',
        encoding: 'utf-8'
      })
    })
    cy.findByLabelText(/Latitude/).type('lat')
    cy.findByLabelText(/Longitude/).type('lon')
    cy.get('a.btn')
      .contains(/Upload/)
      .should('not.be.disabled')
      .click()
    cy.location('pathname').should('match', /opportunities$/)
    // TODO check that the upload:
    // shows status if processing
    // finishes processing
    // has only the one numeric field
    // can be seen on map
    // can be deleted
  })
  /*
  it('can be imported from LODES',function(){
    //cy.findByText(/Fetch LODES/i).click()
    // Error on the server - Cannot download LODES in offline mode.
  })

  it('can be uploaded as shapefile',function(){
    
  })

  it('can be uploaded as grid',function(){
    
  })

  it('can be downloaded as grid',function(){
    
  })

  it('can be downloaded as tiff',function(){
    
  })
*/
  after(() => {
    cy.log('after!')
    // TODO probably will want to clean up here and delete anything imported
  })
})
