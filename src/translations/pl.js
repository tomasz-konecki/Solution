const translations = {
  locale: "pl",
  LoginForm: {
    EnterUsername: "Podaj login",
    EnterPassword: "Podaj hasło",
    Login: "Zaloguj",
    Forgot: "Zapomniałeś",
    Password: "hasła",
    CloseModalMessage:
      "Czy na pewno nie chcesz wybrać preferowanych roli w serwisie ? \nTej operacji nie można powtórzyć !"
  },
  NotFound404: {
    PageNotFound: "Nie znaleziono strony",
    PageNotFoundText: "Nie chcesz tutaj być..."
  },
  TopBar: {
    Logout: "Wyloguj"
  },
  LeftMenu: {
    Users: "Użytkownicy",
    Employees: "Pracownicy",
    Clients: "Klienci",
    Projects: "Projekty",
    Assign: "Przypisz",
    Stats: "Statystyki",
    Skills: "Umiejętności",
    Reports: "Raporty",
    ImportCV: "Import CV"
  },
  PreferedRoles: {
    ChooseRoles: "Wybierz preferowane role w serwisie",
    SavedSuccessfully: "Poprawnie zapisano wybrane role",
    Save: "Zapisz"
  },
  SmoothTable: {
    Search: "Szukaj",
    DeleteFilters: "Usuń filtry",
    ShowDeleted: "Usunięte",
    Deleted: "Usunięty",
    ShowNotActivated: "Nieaktywowane",
    ShowActivated: "Aktywne",
    ShowAll: "Wszystkie",
    Today: "Dzisiaj",
    NoDataOrResults: "Brak danych bądź wyników",
    Reports: "Raporty",
    EmployeeIsNotActivated: "Pracownik jest nieaktywny!"
  },
  StatsContainer: {
    DevLocalization: "Lokalizacja Pracowników",
    EmployeesWithoutProjects: "Pracownicy bez projektów",
    Without: "BEZ",
    With: "Z",
    ActiveProjects: "Aktywne Projekty",
    Active: "Aktywne",
    Archive: "Archiwalne",
    EmployeesFTE: "FTE Pracowników",
    UnUsed: "Wolne",
    Used: "Zajęte"
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
    UserRequestDeleted:
      "Prośba o utworzenie konta użytkownika została usunięta",
    EditUserImperativus: "Edytuj użytkownika",
    DeleteEdit: "Opcje",
    DeleteAdd: "Opcje",
    AddUserWhenRequestImperativus: "Dodaj użytkownika"
  },
  ClientsContainer: {
    Add: "Dodaj",
    Name: "Nazwa",
    Options: "Opcje",
    DeleteClient: "Usuń Klienta",
    EditClient: "Edytuj Klienta",
    ReactivateClient: "Reaktywuj Klienta",
    SaveClient: "Zapisz Klienta",
    ClientRemoved: "Klient został usunięty",
    ClientReactivated: "Klient został reaktywowany",
    Removing: "Zamierzasz usunąć klienta",
    RemovingCloud: "Zamierzasz usunąć chmurę",
    ReactivatingCloud: "Zamierzasz reaktywować chmurę",
    Reactivating: "Zamierzasz reaktywować klienta",
    CloudReactivated: "Chmura została reaktywowana",
    Search: "Szukaj",
    ClientsNotFound: "Brak klientów",
    Activated: "Aktywne",
    NotActivated: "Nieaktywne",
    ClientCloudsList: "Lista Chmur Klienta",
    AddCloud: "Dodaj Chmurę",
    CloudsNotFound: "Nie znaleziono żadnej chmury.",
    CloudName: "Nazwa Chmury",
    NoClientDescription: "Brak opisu Klienta",
    CloudRemoved: "Chmura została usunięta",
    ResponsiblePersonList: "Lista Osób Odpowiedzialnych",
    ResponsiblePersonNotFound: "Nie znaleziono żadnych rekordów.",
    InsertCloudName: "Wpisz nazwę chmury..",
    FirstName: "Imię",
    LastName: "Nazwisko",
    Email: "Email",
    PhoneNumber: "Numer Telefonu",
    Insert: "Wprowadź",
    AddResponsiblePerson: "Dodaj Osobę Odpowiedzialną",
    ResponsiblePersonAdded: "Dodano Osobę Odpowiedzialną.",
    CloudAdded: "Dodano Chmurę.",
    EditCloud: "Edytuj Chmurę",
    Save: "Zapisz",
    CloudEdited: "Edytowano szczegóły Chmury.",
    ResponsiblePersonEdited: "Edytowano szczegóły Osoby Odpowiedzialnej.",
    EditResponsiblePerson: "Edytuj Osobę Odpowiedzialną",
    ReactivatingResponsiblePerson: "Reaktywować Osobę Odpowiedzialną",
    ResponsiblePersonReactivated: "Osoba Odpowiedzialna została Aktywowana.",
    RemovingResponsiblePerson: "Usunąć Osobę Odpowiedzialną",
    ResponsiblePersonRemoved: "Odpowiedzialna Osoba została dezaktywowana.",
    showDeleted: "Pokaż usunięte",
    showActive: "Pokaż aktywne",
    NewInputLabel: "Nazwa Pola",
    NewInputValue: "Wartośc Pola",
    AddInput: "Dodaj pole"
  },
  AddClient: {
    Add: "Dodaj",
    Edit: "Edytuj",
    Client: "Klienta",
    ClientName: "Nazwa Klienta",
    ClientDescription: "Opis Klienta",
    ClientAddedSuccess: "Klient został dodany.",
    ClientEditedSuccess: "Szczegóły Klienta zostały zaktualizowane.",
    Save: "Zapisz"
  },
  ProjectsList: {
    Add: "Dodaj",
    DeleteOwnerFuture:
      "Usunąć {{ownerFullName}} jako właściciela projektu o numerze {{projectName}}",
    OwnerHasBeenDeleted: "Właściciel został usunięty",
    ChangeSkillSettingsFuture:
      "Zmienić ustawienia umiejętności projektu o numerze {{projectId}}",
    SettingsHaveBeenSaved: "Ustawienia zostały zapisane",
    ProjectName: "Nazwa projektu",
    Client: "Klient",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    Status: "Status",
    Activated: "Aktywny",
    NotActivated: "Nieaktywny",
    Closed: "Zamknięty",
    SelectStatus: "Wybierz status...",
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
    SeeMore: "Zobacz więcej",
    Deleted: "Usunięte"
  },
  EmployeesList: {
    Name: "Imię",
    Surname: "Nazwisko",
    Position: "Stanowisko",
    Location: "Lokalizacja",
    Status: "Status",
    AccountActive: "Aktywny",
    AccountInactive: "Nieaktywny",
    SelectStatus: "Wybierz status...",
    DownloadCV: "Pobierz CV",
    Options: "Opcje",
    ActivateEmployee: "Aktywuj pracownika",
    EmployeeHasBeenActivated: "Pracownik został Aktywowany.",
    ActivateEmployeeInfinitive: "Aktywować pracownika",
    DeleteEmployee: "Usuń pracownika",
    DeleteEmployeeInfinitive: "Usunąć pracownika",
    EmployeeHasBeenDeleted: "Pracownik został Usunięty."
  },
  EmployeeDetails: {
    Close: "Zamknij",
    Edit: "Edytuj",
    EmployeeDetails: "Szczegóły Pracownika",
    Active: "Aktywny",
    NotActive: "Nieaktywny",
    Deleted: "Usunięty",
    Details: "Szczegóły",
    Localization: "Lokalizacja",
    Phone: "Telefon",
    Superiors: "Przełożeni",
    EmailMissing: "Brak email'a",
    RoleMissing: "Brak roli",
    NoLevel: "Brak poziomu",
    CallSkype: "Zadzwoń Skype",
    CallBusinessSkype: "Zadzwoń Skype for Business",
    InsertSkypeId: "Wpisz SkypeId",
    SkypeIdUpdated: "Zaktualizowano SkypeId",
    Activate: "Aktywuj",
    BeforeYouChangeStatus: "Zanim zmnienisz status!",
    BeforeYouChangeStatusContent: `Zmiana statusów pracownika polega na przypisaniu mu wymiaru czasu
              pracy oraz poziomu doświadczenia. Pamiętaj, że możesz także
              zmienić jego status na <b>Usunięty</b> co spowoduje zablokowanie
              możliwości edycji. Zmiana statusu na <b>Aktywny</b> pozwoli na
              ponowną zmiane danych tego pracownika.`,
    Save: "Zapisz",
    Delete: "Usuń",
    ActiveProjects: "Aktywne Projekty",
    Skills: "Umiejętności",
    Missing: "Brak",
    Assignments: "Przypisania",
    ProfilePhoto: "Zdjęcie profilowe",
    EmployeeCV: "CV Pracownika",
    DownloadEmployeeCVInWordFormat: "Pobierz CV.docx",
    DownloadEmployeeCVInPdfFormat: "Pobierz CV.pdf"
  },
  List: {
    Search: "wpisz, aby wyszukać...",
    Sort: "Sortuj",
    Filters: "Filtr",
    NoResults: "Brak wyników",
    Default: "Bez filtrowania"
  },
  Quaters: {
    Add: "Dodaj",
    Active: "Aktywny",
    NotActive: "Nieaktywny",
    QuarterTalk: "Rozmowa kwartalna",
    QuaterTalks: "Rozmowy kwartalne",
    Missing: "Brak",
    Deleted: "Usuniętych",
    Active: "Aktywnych",
    Delete: "Usuń",
    DeleteQuarterTalkConfirmation:
      "Czy jestes pewny, że chcesz usunąć rozmowę?",
    OperationSuccessful: "Pomyślnie wykonano operację",
    QuarterTalkAdded: "Pomyślnie dodano rozmowę kwartalną",
    QuarterTalkActivated: "Aktywowano rozmowę kwartalną",
    QuarterTalkHeader: "Panel rozmów kwartalnych",
    QuarterTalkSubHeader: "aktualnie przeglądany użytkownik",
    Users: "Pracownicy",
    PlanQuarter: "Zaplanuj rozmowę",
    AddQuarter: "Dodaj rozmowę",
    ClearHistory: "Wyczyść historię",
    EmptyQuarterTalk: "Ta rozmowa kwartalna nie posiada żadnych odpowiedzi",
    SuccDeletedQuarter: "Wybrana przez Ciebie rozmowa została usunięta",
    SpeechState: "Przebieg rozmowy",
    FindUserModalTitle: "Znajdź użytkownika do przeglądania",
    Next: "Przejdź",
    Worker: "Pracownik",
    WorkerPlaceholder: "wpisz nazwę użytkownika...",
    Deny: "Anuluj",
    MakeSureYouWantDeleteQuarter: "Czy jesteś pewny, że chcesz usunąć tą rozmowę kwartalną?",
    AddQuarterTalk: "Dodaj rozmowę kwartalną",
    Options: "Opcje",
    AddQuestion: "Dodaj pytanie",
    QuestionMenage: "Zarządzaj pytaniami",
    ChooseQuestionHeader: "Wybierz pytania do wypełnienia",
    Start: "Rozpocznij",
    SuccDeleteQuestion: "Pomyślnie usunięto pytanie",
    Date: "Data",
    Quarter: "Kwartał",
    QuestionWillBeHere: "tu pojawi się pytanie" ,
    ChooseOrSelectQuarter: "wpisz lub wybierz kwartał...",
    SuccAddedQuarter: "Pomyślnie utworzono rozmowę kwartalną",
    QuarterItemSubHeader: "przeprowadził",
    Reactivate: "Reaktywuj", 
    Conduct: "przeprowadzi",
    QuarterDeletedPrompt: "Ta rozmowa jest usunięta",
    Year: "Rok",
    PlannedDate: "Planowana data",
    PlannedHour: "Planowana godzina",
    YearHolder: "wybierz lub wpisz planowany rok...",
    Language: "pl",
    Minutes: "minuty",
    QuarterTalksDetails: "Szczegóły rozmowy kwartalnej",
    Plan: "Zaplanuj",
    SuccPlannedQuarter: "Pomyślnie zaplanowano rozmowę kwartalną",
    SugestedHours: "Proponowane godziny",
    From: "od",
    To: "do",
    OccupiedDates: "Zajęte daty",
    CallCalendar: "Kalendarz rozmów",
    Choosen: "Wybrane",
    NotChoosen: "Nie wybrane",
    Deleted: "Usunięte",
    NotDeleted: "Nie usunięte",
    Empty: "Brak rozmów kwartalnych",
    startQuarterTranslation: "Wypełnij pytania",
    NoAnswers: "Ta rozmową się jeszcze nie odbyła",
    Populate: "Uzupełnij rozmowę",
    ConfirmQuestions: "Zatwierdź pytania",
    ForQuarter: "za",
    In: "w",
    InYear: "roku"  ,
    DoneQuarter: "Ta rozmowa została przeprowadzona",
    IncomingQuarter: "Ta rozmowa dopiero się odbędzie"
  },
  EmployeeSkills: {
    Add: "Dodaj",
    Skills: "Umiejętności",
    NoSkills: "Brak umiejętności",
    ManageSkills: "Zarządzaj umiejętnościami",
    Find: "Znajdź",
    ShowAdded: "Pokaż dodane",
    ShowAll: "Pokaż wszystkie",
    NoDataToShow: "Brak danych do wyświetlenia",
    NewSkills: "Nowe umiejętności",
    ApproveChanges: "Zatwierdź zmiany",
    SkillsAddedSuccessfull: "Pomyślnie dodano umiejętności",
    Search: "Wyszukaj",
    SearchInAdded: "szukasz w dodanych...",
    SearchInAll: "szukasz we wszystkich..."
  },
  EmployeeTable: {
    AddedBy: "Dodany przez",
    Project: "Projekt",
    Role: "Rola",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakoczenia",
    EmptyAssignments: "Puste przypisania"
  },
  ActivateCheckbox: {
    ShowDeleted: "Pokaż usunięte"
  },
  EmployeeCertificates: {
    Add: "Dodaj",
    Name: "Nazwa",
    Description: "Opis",
    Date: "Data",
    Options: "Opcje",
    Edit: "Edytuj",
    Delete: "Usuń",
    Title: "Certyfikaty",
    Deleting: "Usunąć certyfikat",
    SuccesfullDelete: "Pomyślnie usunięto certyfikat"
  },
  EmployeeAddCertificate: {
    Add: "Dodaj",
    Name: "Nazwa certifikatu",
    Description: "Opis",
    Date: "Data",
    CertificateAddedSuccessfully: "Certyfikat dodany poprawnie",
    CertificateEditedSuccessfully: "Certyfikat edytowamy poprawnie",
    AddingCertificate: "Dodawanie certyfikatu",
    EditingCertificate: "Edytowanie certyfikatu",
    Edit: "Zapisz"
  },
  EmployeeFeedbacks: {
    Feedbacks: "Opinie",
    Author: "Autor",
    Content: "Treść",
    Project: "Projekt",
    Client: "Klient"
  },
  ShareEmployeesModal: {
    ShareEmployees: "Udostępnij pracowników",
    ChooseEmployeesToShare: "Wybierz pracowników do udostępnienia",
    ChooseLeader: "Wybierz lidera",
    SharedEmployees: "Udostępnieni pracownicy",
    Search: "Wyszukaj",
    StopSharing: "Przestań udostępniać",
    Employees: "Pracownicy",
    ShareTeam: "Udostępnij team",
    Share: "Udostępnij"
  },
  ImportCVContainer: {
    Name: "Nazwa",
    Size: "Rozmiar",
    LastModifiedDate: "Data ostatniej modyfikacji",
    Actions: "Akcje",
    SelectFiles: "Wybierz pliki",
    DropHere: "Przeciągnij pliki lub wciśnij przycisk poniżej.",
    OnlyDocx: "Akceptowane są jedynie pliki z rozszerzeniem .docx",
    Import: "Importuj",
    Imported: "Zaimportowano",
    Result: "Rezultat importu"
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
    OK: ""
  },
  AddProjectOwner: {
    Owners: "Właściciele",
    AddProjectOwner: "Dodaj właściciela projektu.",
    ChooseAnOwner: "Wybierz właściciela projektu.",
    EmployeeNotFound: "Nie znaleziono pracownika.",
    ProjectOwnerHasBeenAdded: "Właściciel został dodany.",
    Delete: "Usuń"
  },
  AddProjectScreen: {
    AddProject: "Dodaj Projekt",
    Next: "Dalej",
    Insert: "Wpisz",
    Name: "Imię",
    Surname: "Nazwisko",
    Phone: "Telefon",
    SelectPeopleToContact: "Wybierz Ludzi do kontaktu",
    ProjectHasBeenAdded: "Projekt został dodany. Jesteś przekierowywany...",
    Back: "Cofnij",
    ResponsiblePerson: "Odpowiedzialna Osoba",
    ProjectName: "Nazwa projektu",
    CannotContainSpecial: "Nazwa projektu nie może zawierać znaków specjalnych",
    Description: "Opis",
    Client: "Klient",
    Cloud: "Wybierz chmure",
    ContactPerson: "Osoba do kontaktu",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    ProjectAddedSuccessfully: "Projekt dodano pomyślnie",
    Add: "Dodaj",
    CloudPlaceHolder: "wpisz własną lub wybierz chmure z listy",
    ClientPlaceHolder: "wpisz własnego klienta lub wybierz z listy"
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
    Confirm: "Potwierdź",
    Next: "Dalej",
    Send: "Potwierdź",
    Back: "Wróć",
    Name: "Nazwa",
    InsertProjectName: "wprowadź nazwę projektu...",
    Description: "Opis",
    InsertProjectDescription: "wprowadź opis projektu...",
    Client: "Klient",
    InsertClientName: "wpisz nazwę klienta bądź wybierz z listy",
    Cloud: "Wybierz chmurę",
    ChooseCloud: "Wpisz nazwę chmury lub wybierz z listy",
    StartDate: "Data rozpoczęcia",
    InsertStartDate: "wprowadź datę rozpoczęcia projektu...",
    EndDate: "Data zakończenia",
    InsertEndDate: "wprowadź datę zakończenia projektu...",
    InsertEmail: "wprowadź adres email...",
    FirstName: "Imię",
    InsertFirstName: "wprowadź imię...",
    LastName: "Nazwisko",
    InsertLastName: "wprowadź nazwisko...",
    PhoneNumber: "Numer telefonu",
    InsertPhoneNumber: "wprowadź numer telefonu...",
    ResponsiblePerson: "Osoba do kontaktu",
  },
  ProjectDetails: {
    GeneralInfo: "Informacje ogólne",
    ResponsiblePerson: "Osoba do kontaktu",
    SkillsRequired: "Umiejętności na potrzeby projektu",
    ShowActiveAssignments: "Pokaż aktywne przypisania",
    Name: "Nazwa",
    Role: "Rola",
    Experience: "Doświadczenie",
    Position: "Stanowisko",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    AssignmentStartDate: "Data rozpoczęcia pracy",
    InsertAssignmentStartDate: "wprowadź datę rozpoczęcia pracy...",
    AssignmentEndDate: "Data zakończenia pracy",
    InsertAssignmentEndDate: "wprowadź datę zakończenia pracy...",
    Responsibilities: "Zakres obowiązków",
    AddResponsibility: "dodaj obowiązek...",
    Employee: "Pracownik",
    FindEmployee: "znajdź pracownika...",
    RoleInProject: "Rola w projekcie",
    SelectRoleInProject: "wybierz lub wpisz role w projekcie...",
    Deleted: "Usunięty",
    Closed: "Zamknięty",
    Inactive: "Nieaktywny",
    Active: "Aktywny",
    DeleteProject: "Usuń projekt",
    ProjectTeam: "Zespół projektowy",
    EmptyProjectTeam: "Ten projekt nie ma jeszcze pracowników",
    ConfirmDeleteProject: "Czy jesteś pewny, że chcesz usunąć ten projekt?",
    Delete: "Usuń",
    AddEmployee: "Dodaj pracownika do projektu",
    FTE: "Długość etatu",
    EmployeeAdded: "Pomyślnie dodano pracownika do projektu",
    EditProject: "Edytuj projekt",
    ActivateProject: "Aktywuj projekt",
    Close: "Zamknij",
    FirstName: "Imię",
    Surname: "Nazwisko",
    Client: "Klient",
    Email: "Email",
    PhoneNumber: "Numer kontaktowy",
    FullName: "Pełna nazwa",
    EstimatedEndDate: "Szacowana data zakończenia",
    Description: "Opis",
    Owners: "Właściciele",
    ToFill: "Do uzupełnienia",
    ToFillEmail: "do@uzupełnienia.com",
    Add: "Dodaj",
    Share:"Udostępnij",
  },
  ResponsiblePersonBlock: {
    NameNoSpecial: "Imię nie może zawierać znaków specjalnych ani cyfr.",
    SurnameNoSpecial: "Nazwisko nie może zawierać znaków specjalnych ani cyfr.",
    EmailToBeValid:
      "Adres email powinien mieć odpowiednią strukturę, np. me@mydomain.com.",
    NumberValid: "Numer telefonu powinien zawierać od 9 do 11 cyfr.",
    Back: "Wróć",
    ResponsiblePerson: "Osoba odpowiedzialna",
    ProjectHasBeenEdited: "Projekt został pomyślnie edytowany"
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
    RolesSuccessfullyEdited: "Role edytowano pomyślnie",
    UserSuccesfullyAdded: "Pomyślnie dodano użytkownika"
  },
  StageOne: {
    SearchAD: "Wyszukaj użytkownika w AD",
    UserNotFoundInAD: "Nie znaleziono użytkownika w AD",
    Next: "Dalej",
    HasAccount: "Ten użytkownik posiada już konto w serwisie",
    SelectUser: "Wybierz użytkownika"
  },
  StageTwo: {
    AddRoles: "Dodaj role!",
    Back: "Powrót",
    UserAddedSuccessfully: "Użytkownik dodany pomyślnie",
    Add: "Dodaj"
  },
  UserDetailsBlock: {
    UserData: "Szczegóły użytkownika",
    Name: "Imię",
    Surname: "Nazwisko",
    Email: "Email",
    Phone: "Telefon",
    Roles: "Role",
    EditRoles: "Edycja ról"
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
    DeleteOwnerFuture:
      "Usunąć {{ownerFullName}} jako właściciela projektu o nazwie {{projectName}}",
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
    ProjectReactivated: "Projekt został reaktywowany",
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
  SkillsContainer: {
    Deletion: "Usuwanie",
    Info1:
      "Ten proces jest permanentny. Usuwa wpis z bazy danych i wszystkich powiązanych miejsc.",
    Info2: "Cofnięcie tej akcji jest niemożliwe.",
    SuccessfullyDeleted: "Pomyślnie usunięto umiejętność"
  },
  FileInput: {
    ChooseFile: "Wybierz plik",
    WrongFileType: "Zły format pliku",
    FileIsTooBig: "Za duży plik",
    WrongAspectRatio: "Obrazek ma złe proporcje"
  },
  SideProgressBar: {
    Notifications: "Powiadomienia",
    SuccessFullyGeneratedReport: "Pomyślnie wygenerowano raport",
    Read: "Odczytane",
    Unread: "Nieodczytane",
    Hour: "godzinę",
    Hours: "godziny",
    HoursPl: "godzin",
    Ago: "temu",
    Day: "dzien",
    Days: "dni",
    Month: "Miesiąc",
    Months: "miesięcy",
    MonthsPl: "miesiące",
    Year: "Rok",
    Years: "lata",
    OneMinute: "Minutę",
    Minutes: "minuty",
    MinutesPl: "minut",
    MarkAllAsRead: "Oznacz wszystkie jako przeczytane",
    DeleteAll: "Usuń wszystkie",
    NoNotifications: "Nie masz żadnych powiadomień."
  },
  Skills: {
    SaveChanges: "Zapisz zmiany",
    InsertSkillName: "wpisz nazwę umiejętności...",
    AddSkillToProject: "Dodaj umiejętność do projektu",
    HideAdded: "Ukryj dodane",
    ShowAdded: "Pokaż dodane",
    NoResults: "Brak wyników dla tego ciągu znaków",
    Confirm: "Zatwierdź",
    ThatProjectDoesntHavaAnySkillAssigned:
      "Ten projekt nie ma żadnych przypisanych umiejętności."
  },
  Skill: {
    SkillName: "Nazwa umiejętności",
    YearsOfExperience: "Lata doświadczenia",
    PutYear: "Dodaj rok",
    PopYear: "Zmniejsz o rok",
    DeleteSkill: "Usuń umiejętność",
    ChangedThings: "Ta umiejętność jest zmieniona",
    SkillLevel: "Poziom umiejętności"
  },
  ProjectTeamTable: {
    Add: "Dodaj",
    Feedback: "Opinia",
    AddFeedbackPlaceholder: "dodaj opinie o pracowniku...",
    StartDate: "Data rozpoczęcia",
    EndDate: "Data zakończenia",
    AddedBy: "Dodany do projektu przez",
    Responsibilities: "Lista obowiązków",
    AddFeedback: "Dodaj opinie o pracowniku",
    FeedbacksList: "Lista opini o pracowniku",
    NoFeedbacks: "Brak opini o tym pracowniku",
    ShowFeedbacks: "Zobacz opinie",
    AddFeedbackShort: "Dodaj opinie",
    FeedbackAdded: "Pomyślnie dodano opinie",
    Author: "Autor",
    DaysAgo: "dni temu",
    OnDate: "w dniu",
    GoIntoEmployeeDetails: "Przejdź do szczegółów pracownika"
  },
  ShareProject :{
    ShareProject:"Udostępnij projekt",
    Confirm: "Zatwierdź",
    ChangesSaved: "Zmiany zostały zapisane",
    NotFound: "Nie znaleziono",
    SelectPersons: "Wybierz osoby",
    Shared: "Udostępnione",
  },
  Reports: {
    LoadingAccountDataPrompt: "Trwa pobieranie zawartości chmury. Proszę czekać..."
  }
};

export default translations;
