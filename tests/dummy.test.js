const listHelper = require("../utils/list_helper")

test('dummy returns one', () => {
  const exercises = []

  const result = listHelper.dummy(exercises)
  expect(result).toBe(1)

})