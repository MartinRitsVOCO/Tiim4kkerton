const blockers = {
  bench: {
    image: "blocker-bench",
    width: 150,
    height: 10,
    visualHeight: 40,
    fromGround: 35
  },
  printer: {
    image: "blocker-printer",
    width: 90,
    height: 75,
    visualHeight: 75,
    fromGround: 20
  },
  trashbin: {
    image: "blocker-trashbin",
    width: 150,
    height: 40,
    visualHeight: 40,
    fromGround: 40
  }
} as const;

export default blockers;