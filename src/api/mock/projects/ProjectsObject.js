export const ProjectsObject = page => {
  return {
    results: [
      {
        id: `pr1-p:${page}`,
        name: `Project 1 (p:${page})`,
        client: "Client 1",
        startDate: "2018-01-01",
        endDate: "2018-03-30",
        teamCount: 5,
        totalCapacity: 4,
        owners: [
          {
            userId: "Egcvbqm"
          },
          {
            userId: "Gbujvmy"
          }
        ],
        isActive: true
      },
      {
        id: `pr2-p:${page}`,
        name: `Project 2 (p:${page})`,
        client: "Client 2",
        startDate: "2018-02-01",
        endDate: "2018-04-30",
        teamCount: 7,
        totalCapacity: 6.5,
        owners: [
          {
            userId: "Xdeiftk"
          }
        ],
        isActive: false
      },
      {
        id: `pr3-p:${page}`,
        name: `Project 3 (p:${page})`,
        client: "Client 3",
        startDate: "2018-03-01",
        endDate: "2018-05-30",
        teamCount: 6,
        totalCapacity: 8,
        owners: [
          {
            userId: "Dmvwizg"
          },
          {
            userId: "Zdywuns"
          },
          {
            userId: "Zcqjhtr"
          }
        ],
        isActive: true
      },
      {
        id: `pr4-p:${page}`,
        name: `Project 4 (p:${page})`,
        client: "Client 4",
        startDate: "2018-01-02",
        endDate: "2018-06-30",
        teamCount: 10,
        totalCapacity: 9.5,
        owners: [
          {
            userId: "Macfoml"
          },
          {
            userId: "Utbxowe"
          }
        ],
        isActive: true
      },
      {
        id: `pr5-p:${page}`,
        name: `Project 5 (p:${page})`,
        client: "Client 5",
        startDate: "2018-02-02",
        endDate: "2018-07-30",
        teamCount: 8,
        totalCapacity: 12,
        owners: [
          {
            userId: "Jqyrtwv"
          },
          {
            userId: "Pnxrilk"
          },
          {
            userId: "Sdzvgey"
          }
        ],
        isActive: false
      }
    ],
    currentPage: 1,
    totalPageCount: 2
  };
};
