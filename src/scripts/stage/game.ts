const game = {
  data: {
    level: 1,
    score: 0,
    answers: [] as boolean[],
    difficulty: 1,
  },

  nextLevel(isCorrect: boolean) {
    this.data.answers.push(isCorrect);
    this.data.difficulty += isCorrect ? -0.1 : 0.1;
    this.data.level++;
  },
};

export default game;