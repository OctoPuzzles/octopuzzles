DEFINE TABLE vote SCHEMAFULL 
  PERMISSIONS 
    FOR select FULL
    FOR delete, update, create WHERE ($scope = 'user' AND user = $auth.id);

DEFINE FIELD in ON TABLE vote TYPE record(user) ASSERT $value != NONE;
DEFINE FIELD out ON TABLE vote TYPE record(sudoku) ASSERT $value != NONE;
DEFINE FIELD val ON TABLE vote TYPE int ASSERT $value = 1 OR $value = -1;