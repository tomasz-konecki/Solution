const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed nibh sagittis, tristique mi et, suscipit mauris. Etiam volutpat a arcu pulvinar dictum. Curabitur vel dictum lacus, a interdum nisl. Suspendisse potenti. Nullam fringilla, nisl nec lobortis viverra, leo nunc lobortis lacus, vitae convallis ligula ipsum et mauris. Nulla vel eleifend elit. Nunc sed eros ut dui placerat tempus. Suspendisse eget lacinia nunc.

Suspendisse at metus vestibulum, placerat felis id, imperdiet quam. Cras ac sapien ullamcorper, scelerisque ipsum vel, elementum nibh. Vivamus rhoncus odio sit amet interdum luctus. Aliquam erat volutpat. Ut in porttitor ligula. Proin eget arcu in ipsum tristique rutrum non sit amet velit. Ut nec mollis nulla. Aliquam dapibus eleifend leo ac finibus. Ut tristique tristique sollicitudin. Nulla facilisi. Sed in lorem egestas, vestibulum erat a, feugiat diam.

Ut ut turpis faucibus, molestie justo vitae, mollis mi. Nulla euismod eu diam quis commodo. Nullam tristique imperdiet felis, sit amet malesuada nisl semper sit amet. Pellentesque maximus erat eu lacus aliquet imperdiet. Donec vitae tincidunt diam, nec laoreet libero. Suspendisse scelerisque pellentesque dolor, in aliquet nibh blandit nec. Nunc faucibus dui non ante interdum, vitae pellentesque ligula porta. Pellentesque mattis placerat sapien ac placerat. Integer imperdiet massa at finibus commodo. Nullam tincidunt augue nulla, facilisis luctus nisl pellentesque consequat. Vivamus dui ex, tempor a consectetur vitae, interdum nec lacus. Sed eu magna commodo, fringilla nisl id, ornare sapien. Phasellus tincidunt orci ut sodales tempus. Cras in odio vel tortor accumsan imperdiet. Nullam eros augue, sollicitudin sit amet leo vitae, porttitor hendrerit risus.

Nullam auctor nisi sit amet eros elementum pharetra. Fusce venenatis varius sollicitudin. Aliquam purus urna, pulvinar vitae congue ac, gravida molestie est. Phasellus sollicitudin odio vel justo viverra placerat. Sed arcu leo, blandit quis aliquet eu, accumsan quis quam. Etiam quis turpis porta, accumsan urna at, hendrerit nibh. Nunc sed venenatis purus. Nunc vulputate enim id risus laoreet faucibus. Sed tristique ipsum sed venenatis venenatis.

Vestibulum at dignissim odio, at laoreet ligula. Morbi gravida mi sit amet pharetra euismod. Vestibulum pharetra, purus a finibus viverra, orci augue viverra elit, porta finibus justo ipsum nec tellus. Duis ac dui urna. Sed blandit tortor id nibh mattis, ut convallis nulla gravida. Maecenas et mi sit amet erat hendrerit scelerisque. Donec sed sodales enim, et placerat sem. Duis et maximus mauris. Duis rhoncus mauris quis tellus commodo, vitae ornare lacus gravida. Maecenas semper, sem quis aliquet sodales, dui arcu tristique purus, ut pharetra tellus neque vitae dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus consequat lectus non lorem eleifend, sit amet vulputate urna vehicula. Mauris sodales bibendum mi. Suspendisse a porta nulla. Morbi condimentum velit in augue vehicula posuere.`;

export const ProjectsObject = page => {
  return {
    results: [
      {
        id: `pr1-p:${page}`,
        name: `Project 1 (p:${page})`,
        description,
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
        description,
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
        description,
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
        description,
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
        description,
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
      },
      {
        id: `pr6-p:${page}`,
        name: `Project 6 (p:${page})`,
        description,
        client: "Client 6",
        startDate: "2018-03-01",
        endDate: "2018-08-30",
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
        id: `pr7-p:${page}`,
        name: `Project 7 (p:${page})`,
        description,
        client: "Client 7",
        startDate: "2018-04-01",
        endDate: "2018-09-30",
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
        id: `pr8-p:${page}`,
        name: `Project 8 (p:${page})`,
        description,
        client: "Client 8",
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
        id: `pr9-p:${page}`,
        name: `Project 9 (p:${page})`,
        description,
        client: "Client 9",
        startDate: "2018-05-02",
        endDate: "2018-10-30",
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
        id: `pr10-p:${page}`,
        name: `Project 10 (p:${page})`,
        description,
        client: "Client 10",
        startDate: "2018-06-02",
        endDate: "2018-11-30",
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
      },
      {
        id: `pr11-p:${page}`,
        name: `Project 11 (p:${page})`,
        description,
        client: "Client 11",
        startDate: "2018-03-01",
        endDate: "2018-12-30",
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
        id: `pr12-p:${page}`,
        name: `Project 12 (p:${page})`,
        description,
        client: "Client 12",
        startDate: "2018-02-01",
        endDate: "2018-09-30",
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
        id: `pr13-p:${page}`,
        name: `Project 13 (p:${page})`,
        description,
        client: "Client 13",
        startDate: "2018-01-01",
        endDate: "2018-09-30",
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
        id: `pr14-p:${page}`,
        name: `Project 14 (p:${page})`,
        description,
        client: "Client 14",
        startDate: "2018-01-02",
        endDate: "2018-09-30",
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
        id: `pr15-p:${page}`,
        name: `Project 15 (p:${page})`,
        description,
        client: "Client 15",
        startDate: "2018-02-02",
        endDate: "2018-10-30",
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
      },
      {
        id: `pr16-p:${page}`,
        name: `Project 16 (p:${page})`,
        description,
        client: "Client 16",
        startDate: "2018-01-01",
        endDate: "2018-11-30",
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
        id: `pr17-p:${page}`,
        name: `Project 17 (p:${page})`,
        description,
        client: "Client 17",
        startDate: "2018-03-01",
        endDate: "2018-12-30",
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
        id: `pr18-p:${page}`,
        name: `Project 18 (p:${page})`,
        description,
        client: "Client 18",
        startDate: "2018-02-01",
        endDate: "2018-08-30",
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
        id: `pr19-p:${page}`,
        name: `Project 19 (p:${page})`,
        description,
        client: "Client 19",
        startDate: "2018-01-02",
        endDate: "2018-08-30",
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
        id: `pr20-p:${page}`,
        name: `Project 20 (p:${page})`,
        description,
        client: "Client 20",
        startDate: "2018-02-02",
        endDate: "2018-10-30",
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
      },
      {
        id: `pr21-p:${page}`,
        name: `Project 21 (p:${page})`,
        description,
        client: "Client 21",
        startDate: "2018-03-01",
        endDate: "2018-10-30",
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
        id: `pr22-p:${page}`,
        name: `Project 22 (p:${page})`,
        description,
        client: "Client 22",
        startDate: "2018-02-01",
        endDate: "2018-09-30",
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
        id: `pr23-p:${page}`,
        name: `Project 23 (p:${page})`,
        description,
        client: "Client 23",
        startDate: "2018-01-01",
        endDate: "2018-07-30",
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
        id: `pr24-p:${page}`,
        name: `Project 24 (p:${page})`,
        description,
        client: "Client 24",
        startDate: "2018-02-02",
        endDate: "2018-10-30",
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
        id: `pr25-p:${page}`,
        name: `Project 25 (p:${page})`,
        description,
        client: "Client 25",
        startDate: "2018-01-02",
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
    currentPage: page,
    totalPageCount: 60
  };
};
