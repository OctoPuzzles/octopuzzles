DEFINE TABLE walkthrough SCHEMAFULL
    PERMISSIONS 
        FOR select FULL
        FOR delete, update, create WHERE ($scope = 'user' AND user = $auth.id);

DEFINE FIELD sudoku ON TABLE walkthrough TYPE record(sudoku);
DEFINE FIELD user ON TABLE walkthrough TYPE record(user);
DEFINE FIELD steps ON TABLE walkthrough TYPE array;
DEFINE FIELD steps.* ON TABLE walkthrough TYPE record(userInputs);

DEFINE EVENT delete_walkthrough ON TABLE walkthrough WHEN $event = 'DELETE' THEN (DELETE FROM array::distinct($before.steps));
DEFINE EVENT update_walkthrough ON TABLE walkthrough WHEN $event = 'UPDATE' THEN (DELETE FROM array::complement($before.steps, $after.steps));
