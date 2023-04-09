DEFINE TABLE commented SCHEMAFULL 
  PERMISSIONS 
    FOR select FULL
    FOR delete, update, create WHERE ($scope = 'user' AND user = $auth.id);

DEFINE FIELD in ON TABLE commented TYPE record(user) ASSERT $value != NONE;
DEFINE FIELD out ON TABLE commented TYPE record(sudoku) ASSERT $value != NONE;
DEFINE FIELD body ON TABLE commented TYPE string ASSERT $value != NONE;

DEFINE FIELD created ON TABLE user TYPE datetime VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE user TYPE datetime VALUE time::now();