const translations = {
  locale: "en",
  LoginForm: {
    EnterUsername: "Enter username",
    EnterPassword: "Enter password",
    Login: "Login",
    Forgot: "Forgot",
    Password: "password"
  },
  TopBar: {
    Logout: "Logout"
  },
  LeftMenu: {
    Users: "Users",
    Employees: "Employees",
    Projects: "Projects",
    Assign: "Assign",
    Stats: "Statistics",
    Skills: "Skills"
  },
  SmoothTable: {
    Search: "Search",
    DeleteFilters: "Delete filters",
    ShowDeleted: "Show deleted",
    ShowNotActivated: "Show not activated",
    ShowActivated: "Show activated",
    Today: "Today",
    NoDataOrResults: "No data or results given"
  },
  UsersList: {
    Add: "Add",
    Name: "Name",
    Surname: "Surname",
    Email: "Email",
    Phone: "Phone",
    Date: "Date",
    userId: "User Id",
    ReactivateUserImperativus: "Reactivate user",
    ReactivateUserInfinitive: "Reactivate użytkownika",
    UserReactivated: "User has been reactivated",
    DeleteUserImperativus: "Delete user",
    DownloadCV: "Download CV",
    DeleteUserInfinitive: "Delete user",
    DeleteUserRequestImperativus: "Delete user request",
    DeleteUserRequestInfinitive: "Delete user request",
    UserDeleted: "User has been deleted",
    UserRequestDeleted: "Account request has been deleted",
    EditUserImperativus: "Edit user",
    DeleteEdit: "Delete/Edit",
    DeleteAdd: "Delete/Add",
    AddUserWhenRequestImperativus: "Add user",

  },
  ProjectsList: {
    Add: "Add",
    DeleteOwnerFuture: "Delete {{ownerFullName}} as owner of project {{projectName}}",
    OwnerHasBeenDeleted: "Owner has been deleted",
    ChangeSkillSettingsFuture: "Change skill settings of project #{{projectId}}",
    SettingsHaveBeenSaved: "Settings have been saved",
    ProjectName: "Project name",
    Client: "Client",
    StartDate: "Start date",
    EndDate: "End date",
    Status: "Status",
    Active: "Active",
    Closed: "Closed",
    CloseProjectImperativus: "Close project",
    CloseProjectInfinitive: "Close project",
    ProjectClosed: "Project has been closed",
    ReactivateProjectImperativus: "Reactivate project",
    ReactivateProjectInfinitive: "Reactivate project",
    ProjectReactivated: "Project has been reactivated",
    DeleteProjectImperativus: "Delete project",
    DeleteProjectInfinitive: "Delete project",
    ProjectDeleted: "Project has been deleted",
    EditProject: "Edit project",
    DeactivateDeleteEdit: "Deactivate/Delete/Edit",
    SeeMore: "See more"
  },
  EmployeesList: {
    Name: "Name",
    Surname: "Surname",
    Position: "Position",
    Location: "Location",
    Status: "Status",
    AccountActive: "Active",
    AccountInactive: "Inactive"
  },
  Confirmation: {
    YouAreAboutTo: "You are about to",
    AreYouSure: "Are you sure?",
    ActionRollbackWarning: "Rollback might be not available",
    Confirm: "Confirm"
  },
  ResultBlock: {
    OperationSuccessful: "Operation executed successfully",
    BadRequest: "Bad request",
    Unauthorized: "Unauthorized",
    Forbidden: "Forbidden",
    NotFound: "Not found",
    NotAcceptable: "Not acceptable",
    InternalServerError: "Internal server error",
    NotImplemented: "Functionality not implemented yet",
    ServiceUnavailable: "Service is currently unavailable",
    GatewayTimeout: "Timeout",
    UnexpectedError: "Unexpected error occured",
    ErrorModel: "Error Model",
    Error: "Error",
    OK: "",
  },
  EmployeesRowUnfurl: {
    ActivateEmployee: "Activate employee",
    Confirm: "Confirm",
    Cancel: "Cancel",
    Edit: "Edit",
    Save: "Save",
    Add: "Add"
  },
  AddProjectOwner: {
    AddOwner: "Add owner",
    OwnersAddedSuccessfully: "Owners added successfully",
    Add: "Add"
  },
  AddProjectScreen: {
    ProjectName: "Project name",
    CannotContainSpecial: "Project name cannot contain special characters",
    Description: "Description",
    Client: "Client",
    ContactPerson: "Responsible person",
    StartDate: "Start date",
    EndDate: "End Date",
    ProjectAddedSuccessfully: "Project added successfully",
    Add: "Add"
  },
  EditProjectDetails: {
    ProjectSuccessfullyEdited: "Project edited successfully"
  },
  ProjectDetailsBlock: {
    EditProjectData: "Edit project data",
    ProjectName: "Project name",
    CannotContainSpecial: "Project name cannot contain special characters",
    Description: "Description",
    Client: "Client",
    ContactPerson: "Responsible person",
    StartDate: "Start date",
    EndDate: "End date",
    Today: "Today",
    Confirm: "Confirm"
  },
  ResponsiblePersonBlock: {
    NameNoSpecial: "Name cannot contain either special characters or digits.",
    SurnameNoSpecial: "Surname cannot contain either special characters or digits.",
    EmailToBeValid: "Email address should have the appropriate structure ie. someone@something.com",
    NumberValid: "Phone number must contain 9 to 11 digits"
  },
  ProjectRowUnfurl: {
    OwnersList: "Owners",
    ProjectId: "Project ID",
    Description: "Description",
    CurrentlyNoSkillsAssigned: "Currently no skills assigned",
    EditSkills: "Edit skills",
    Add: "Add",
    Save: "Save",
    More: "More"
  },
  SkillsSelect: {
    AddNew: "Add new",
    AddingEllipsis: "Adding",
    Error: "Error"
  },
  EditUserDetails: {
    Confirm: "Confirm",
    RolesSuccessfullyEdited: "Roles edited successfully"
  },
  StageOne: {
    SearchAD: "Search Active Directory",
    Next: "Next"
  },
  StageTwo: {
    AddRoles: "Add roles!",
    Back: "Back",
    UserAddedSuccessfully: "User added successfully",
    Add: "Add"
  },
  UserDetailsBlock: {
    EditUsersData: "Edit users data",
    Name: "Name",
    Surname: "Surname",
    Email: "Email",
    Phone: "Phone",
    Roles: "Roles"
  },
  UserRoleAssigner: {
    Developer: "Developer",
    TeamLeader: "Team Leader",
    HumanResources: "Human Resources",
    Tradesman: "Tradesman",
    Administrator: "Administrator"
  },
  LoggedInUser: {
    LoggedIn: "Logged in"
  },
  ProjectDetailContainer: {
    Active: "Active",
    Inactive: "Inactive",
    EditProject: "Edit project",
    Overview: "Overview",
    Client: "Client",
    Deleted: "Deleted",
    StartDate: "Start date",
    EstimatedEndDate: "Estimated end date",
    Name: "Name",
    Surname: "Surname",
    PhoneNumber: "Phone #",
    Email: "Email",
    Owners: "Owners",
    Description: "Description",
    Cancel: "Cancel",
    Add: "Add",
    Save: "Save",
    Edit: "Edit",
    DeleteOwnerFuture: "Delete {{ownerFullName}} as owner of project {{projectName}}",
    OwnerHasBeenDeleted: "Owner has been deleted",
    ResponsiblePerson: "Responsible person",
    Yes: "Yes",
    No: "No",
    Deactivate: "Deactivate",
    Delete: "Delete",
    Close: "Close",
    Reactivate: "Reactivate",
    CloseProjectInfinitive: "Close project",
    ProjectClosed: "Project has been closed",
    DeleteProjectInfinitive: "Delete project",
    ProjectDeleted: "Project has been deleted",
    ReactivateProjectInfinitive: "Reactivate project",
    ProjectReactivated: "Project has been reactivated"
  },
  TeamMember: {
    AssignedCapacity: "Assigned capacity",
    ProjectRole: "Project role",
    Seniority: "Seniority",
    AddedBy: "Added by",
    ResponsibleFor: "Responsible for",
    Begun: "Begun",
    Ends: "Ends"
  },
  EmployeeDetailContainer: {
    ErrorOccuredSHNBS: "Error occured, skills have not been sent",
    NoSkills: "No skills here",
    Active: "Active",
    Inactive: "Inactive",
    Title: "Title",
    Seniority: "Seniority",
    Localization: "Localization",
    Email: "Email",
    Phone: "Phone #",
    Capacity: "Capacity",
    Cancel: "Cancel",
    Add: "Add",
    Save: "Save",
    Activate: "Activate",
    Edit: "Edit"
  },
  AssignsContainer: {
    LastName: "Last/Name",
    Position: "Position",
    Skills: "Skills(comma-separated)",
    MinLevelAbove: "Min level above:",
    MinExperience: "Min. years of exp. of.",
    Name: "Name",
    Projects: "Projects",
    Employees: "Employees"
  },
  SkillsContainer: {
    Deletion: "Deletion",
    Info1: "Deletion will be permanent, removing entries from the database and all places where referenced.",
    Info2: "Rollback of this action is not available.",
    SuccessfullyDeleted: "Successfully deleted skill"
  }
};

export default translations;
