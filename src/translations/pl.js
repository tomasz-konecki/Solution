const translations = {
  locale: "pl",
  LoginForm: {
    EnterUsername: "Podaj login",
    EnterPassword: "Podaj hasło",
    Login: "Zaloguj",
    Forgot: "Zapomniałeś",
    Password: "hasła"
  },
  TopBar: {
    Logout: "Wyloguj"
  },
  LeftMenu: {
    Users: "Użytkownicy",
    Employees: "Pracownicy",
    Projects: "Projekty",
    Assign: "Przypisz",
    Stats: "Statystyki",
    Skills: "Umiejętności",
    Reports: "Raporty"
  },
  SmoothTable: {
    Search: "Szukaj",
    DeleteFilters: "Usuń filtry",
    ShowDeleted: "Pokaż usunięte",
    ShowNotActivated: "Pokaż nieaktywowane",
    ShowActivated: "Pokaż aktywne",
    Today: "Dzisiaj",
    NoDataOrResults: "Brak danych bądź wyników"
  },
  UsersList: {
    Add: "Dodaj",
    Name: "Imię",
    Surname: "Nazwisko",
    Email: "Email",
    Phone: "Telefon",
    Date: "Data",
    userId: "Id Użytkownika",
    ReactivateUserImperativus: "Reaktywuj użytkownika",
    ReactivateUserInfinitive: "Reaktywować użytkownika",
    UserReactivated: "Użytkownik został reaktywowany",
    DeleteUserImperativus: "Usuń użytkownika",
    DownloadCV: "Pobierz CV",
    DeleteUserInfinitive: "Usunąć użytkownika",
    DeleteUserRequestImperativus: "Usuń prośbę o utworzenie konta",
    DeleteUserRequestInfinitive: "Usunąć prośbę o utworzenie konta",
    UserDeleted: "Użytkownik został usunięty",
    UserRequestDeleted: "Prośba o utworzenie konta użytkownika została usunięta",
    EditUserImperativus: "Edytuj użytkownika",
    DeleteEdit: "Usuń/Edytuj",
    DeleteAdd: "Usuń/Dodaj",
    AddUserWhenRequestImperativus: "Dodaj użytkownika",

  },
  ProjectsList: {
    Add: "Dodaj",
    DeleteOwnerFuture: "Usunąć {{ownerFullName}} jako właściciela projektu o numerze {{projectName}}",
    OwnerHasBeenDeleted: "Właściciel został usunięty",
    ChangeSkillSettingsFuture: "Zmienić ustawienia umiejętności projektu o numerze {{projectId}}",
    SettingsHaveBeenSaved: "Ustawienia zostały zapisane",
    ProjectName: "Nazwa projektu",
    Client: "Klient",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    Status: "Status",
    Active: "Aktywny",
    Closed: "Zakończony",
    CloseProjectImperativus: "Zamknij projekt",
    CloseProjectInfinitive: "Zamknąć projekt",
    ProjectClosed: "Projekt został zamknięty",
    ReactivateProjectImperativus: "Reaktywuj projekt",
    ReactivateProjectInfinitive: "Reaktywować projekt",
    ProjectReactivated: "Projekt został reaktywowany",
    DeleteProjectImperativus: "Usuń projekt",
    DeleteProjectInfinitive: "Usunąć projekt",
    ProjectDeleted: "Projekt został usunięty",
    EditProject: "Edytuj projekt",
    DeactivateDeleteEdit: "Deaktywuj/Usuń/Edytuj",
    SeeMore: "Zobacz więcej"
  },
  EmployeesList: {
    Name: "Imię",
    Surname: "Nazwisko",
    Position: "Stanowisko",
    Location: "Lokalizacja",
    Status: "Status",
    AccountActive: "Aktywny",
    AccountInactive: "Nieaktywny"
  },
  Confirmation: {
    YouAreAboutTo: "Właśnie chcesz",
    AreYouSure: "Jesteś pewien?",
    ActionRollbackWarning: "Cofnięcie tej akcji może być niemożliwe",
    Confirm: "Potwierdź"
  },
  ResultBlock: {
    OperationSuccessful: "Operacja wykonana pomyślnie",
    BadRequest: "Nieprawidłowe dane",
    Unauthorized: "Błąd autoryzacji",
    Forbidden: "Brak dostępu",
    NotFound: "Nie znaleziono ścieżki!",
    NotAcceptable: "Nieakceptowalne dane",
    InternalServerError: "Wewnętrzny błąd serwera",
    NotImplemented: "Funkcjonalność jeszcze nie istnieje",
    ServiceUnavailable: "Serwer niedostępny",
    GatewayTimeout: "Brak odpowiedzi",
    UnexpectedError: "Nieoczekiwany błąd",
    ErrorModel: "Model błędu",
    Error: "Błąd",
    OK: "",
  },
  EmployeesRowUnfurl: {
    ActivateEmployee: "Aktywuj pracownika",
    Confirm: "Potwierdź",
    Cancel: "Anuluj",
    Edit: "Edytuj",
    Save: "Zapisz",
    Add: "Dodaj"
  },
  AddProjectOwner: {
    AddOwner: "Dodaj właściciela",
    OwnersAddedSuccessfully: "Właścicieli dodano pomyślnie",
    Add: "Dodaj"
  },
  AddProjectScreen: {
    ProjectName: "Nazwa projektu",
    CannotContainSpecial: "Nazwa projektu nie może zawierać znaków specjalnych",
    Description: "Opis",
    Client: "Klient",
    ContactPerson: "Osoba do kontaktu",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    ProjectAddedSuccessfully: "Projekt dodano pomyślnie",
    Add: "Dodaj"
  },
  EditProjectDetails: {
    ProjectSuccessfullyEdited: "Projekt edytowano pomyślnie"
  },
  ProjectDetailsBlock: {
    EditProjectData: "Edycja danych projektu",
    ProjectName: "Nazwa projektu",
    CannotContainSpecial: "Nazwa projektu nie może zawierać znaków specjalnych",
    Description: "Opis",
    Client: "Klient",
    ContactPerson: "Osoba do kontaktu",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    Today: "Dzisiaj",
    Confirm: "Potwierdź"
  },
  ResponsiblePersonBlock: {
    NameNoSpecial: "Imię nie może zawierać znaków specjalnych ani cyfr.",
    SurnameNoSpecial: "Nazwisko nie może zawierać znaków specjalnych ani cyfr.",
    EmailToBeValid: "Adres email powinien mieć odpowiednią strukturę, np. me@mydomain.com.",
    NumberValid: "Numer telefonu powinien zawierać od 9 do 11 cyfr."
  },
  ProjectRowUnfurl: {
    OwnersList: "Lista właścicieli",
    ProjectId: "ID Projektu",
    Description: "Opis",
    CurrentlyNoSkillsAssigned: "Obecnie brak przypisanych umiejętności",
    EditSkills: "Edytuj umiejętności",
    Add: "Dodaj",
    Save: "Zapisz",
    More: "Więcej"
  },
  SkillsSelect: {
    AddNew: "Dodaj nowy",
    AddingEllipsis: "Dodawanie",
    Error: "Błąd"
  },
  EditUserDetails: {
    Confirm: "Potwierdź",
    RolesSuccessfullyEdited: "Role edytowano pomyślnie"
  },
  StageOne: {
    SearchAD: "Wyszukaj użytkownika w AD",
    Next: "Dalej"
  },
  StageTwo: {
    AddRoles: "Dodaj role!",
    Back: "Powrót",
    UserAddedSuccessfully: "Użytkownik dodany pomyślnie",
    Add: "Dodaj"
  },
  UserDetailsBlock: {
    EditUsersData: "Edycja danych użytkownika",
    Name: "Imię",
    Surname: "Nazwisko",
    Email: "Email",
    Phone: "Telefon",
    Roles: "Role"
  },
  UserRoleAssigner: {
    Developer: "Developer",
    TeamLeader: "Team Leader",
    HumanResources: "Human Resources",
    Tradesman: "Tradesman",
    Administrator: "Administrator"
  },
  LoggedInUser: {
    LoggedIn: "Zalogowany"
  },
  ProjectDetailContainer: {
    Active: "Aktywny",
    Inactive: "Nieaktywny",
    EditProject: "Edytuj projekt",
    Overview: "Pogląd",
    Client: "Klient",
    Deleted: "Usunięty",
    StartDate: "Rozpoczęty",
    EstimatedEndDate: "Przewidywany na",
    Name: "Imię",
    Surname: "Nazwisko",
    PhoneNumber: "Nr. telefonu",
    Email: "Email",
    Owners: "Właściciele",
    Description: "Opis",
    Cancel: "Anuluj",
    Add: "Dodaj",
    Save: "Zapisz",
    Edit: "Edytuj",
    DeleteOwnerFuture: "Usunąć {{ownerFullName}} jako właściciela projektu o nazwie {{projectName}}",
    OwnerHasBeenDeleted: "Właściciel został usunięty",
    ResponsiblePerson: "Osoba odpowiedzialna",
    Yes: "Tak",
    No: "Nie",
    Deactivate: "Deaktywuj",
    Delete: "Usuń",
    Close: "Zamknij",
    Reactivate: "Reaktywuj",
    CloseProjectInfinitive: "Zamknąć projekt",
    ProjectClosed: "Projekt został zamknięty",
    DeleteProjectInfinitive: "Usunąć projekt",
    ProjectDeleted: "Projekt został usunięty",
	ReactivateProjectInfinitive: "Reaktywować projekt",
    ProjectReactivated: "Projekt został reaktywowany"
  },
  TeamMember: {
    AssignedCapacity: "Przypisany na etat",
    ProjectRole: "Rola w projekcie",
    Seniority: "Poziom pracownika",
    AddedBy: "Dodany przez",
    ResponsibleFor: "Odpowiedzialny za",
    Begun: "Rozpoczął",
    Ends: "Zakończy"
  },
  EmployeeDetailContainer: {
    ErrorOccuredSHNBS: "Wystąpił błąd, umiejętności nie zostały przesłane",
    NoSkills: "Brak umiejętności",
    Active: "Aktywny",
    Inactive: "Nieaktywny",
    Title: "Stanowisko",
    Seniority: "Stopień",
    Localization: "Lokalizacja",
    Email: "Email",
    Phone: "Telefon",
    Capacity: "Capacity",
    Cancel: "Anuluj",
    Add: "Dodaj",
    Save: "Zapisz",
    Activate: "Aktywuj",
    Edit: "Edytuj"
  },
  AssignsContainer: {
    LastName: "Imię/Nazwisko",
    Position: "Stanowisko",
    Skills: "Umiejętności(po przecinku)",
    MinLevelAbove: "Minimalny poziom powyż.",
    MinExperience: "Min. lat doświadczenia",
    Name: "Nazwa",
    Projects: "Projekty",
    Employees: "Pracownicy"
  },
  SkillsContainer: {
    Deletion: "Usuwanie",
    Info1: "Ten proces jest permanentny. Usuwa wpis z bazy danych i wszystkich powiązanych miejsc.",
    Info2: "Cofnięcie tej akcji jest niemożliwe.",
    SuccessfullyDeleted: "Pomyślnie usunięto umiejętność"
  }
 
};

export default translations;
