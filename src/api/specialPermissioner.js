const specialPermissioner = () => {
  return {
    projects: {
      isInTeam: (projectObject, loggedInId) => {
        projectObject.team.map(({ id }) => {
          if (id === loggedInId) return true;
          return false;
        });
      },
      isOwner: (projectObject, loggedInId) => {
        let isOwner = false;
        projectObject.owners &&
          projectObject.owners.map(({ id }) => {
            if (id === loggedInId) isOwner = true;
          });
        return isOwner;
      }
    }
  };
};

export default specialPermissioner;
