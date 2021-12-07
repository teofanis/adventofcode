const input = [
    4, 3, 3, 5, 4, 1, 2, 1, 3, 1, 1, 1, 1, 1, 2, 4, 1, 3, 3, 1, 1, 1, 1, 2, 3, 1,
    1, 1, 4, 1, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 5, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 4, 2, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 4, 1, 3, 2, 2, 3, 1, 1, 1, 4, 1, 1, 1, 1, 5, 1, 1, 1, 5,
    1, 1, 3, 1, 1, 2, 4, 1, 1, 3, 2, 4, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 4,
    1, 1, 1, 3, 2, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 4, 1, 5, 1, 3, 4, 1, 1, 1, 1,
    2, 1, 2, 1, 1, 1, 2, 2, 1, 2, 3, 5, 1, 1, 1, 1, 3, 5, 1, 1, 1, 2, 1, 1, 4, 1,
    1, 5, 1, 4, 1, 2, 1, 3, 1, 5, 1, 4, 3, 1, 3, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 4,
    5, 1, 1, 1, 1, 1, 3, 1, 3, 4, 1, 1, 4, 1, 1, 3, 1, 3, 1, 1, 4, 5, 4, 3, 2, 5,
    1, 1, 1, 1, 1, 1, 2, 1, 5, 2, 5, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 5, 1, 2, 1,
    2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 5, 1, 3, 5, 5, 1, 1, 1, 2,
    1, 2, 1, 5, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1,
  ]
  
  const findNumberOfLanternfishForDays = (input, days) => {
    let day = 0
    let state = new Array(9).fill(0)
    input.forEach((item) => (state[item] += 1))
    while (day < days) {
      let dailyState = new Array(9).fill(0)
      for (let i = 1; i < state.length; i++) {
        //move to the left;
        dailyState[i - 1] = state[i]
      }
      dailyState[8] = state[0] //new borns
      dailyState[6] += state[0] // num of dead fish that "restarted" at 6
      state = dailyState
      day += 1
    }
  
    return state.reduce((sum, num) => sum + num, 0)
  }
  findNumberOfLanternfishForDays(input, 80) //part 1
  findNumberOfLanternfishForDays(input, 256) //part 2