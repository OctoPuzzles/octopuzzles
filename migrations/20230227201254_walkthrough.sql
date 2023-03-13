DEFINE TABLE solutionStep SCHEMAFULL;

DEFINE FIELD cellValues ON TABLE solutionStep TYPE array;
DEFINE FIELD cellValues.* ON TABLE solutionStep TYPE array;
DEFINE FIELD cellValues.*.* ON TABLE solutionStep TYPE object;
DEFINE FIELD cellValues.*.*.digits ON TABLE solutionStep TYPE array;
DEFINE FIELD cellValues.*.*.digits.* ON TABLE solutionStep TYPE string;
DEFINE FIELD cellValues.*.*.cornermarks ON TABLE solutionStep TYPE array;
DEFINE FIELD cellValues.*.*.cornermarks.* ON TABLE solutionStep TYPE string;
DEFINE FIELD cellValues.*.*.centermarks ON TABLE solutionStep TYPE array;
DEFINE FIELD cellValues.*.*.centermarks.* ON TABLE solutionStep TYPE string;
DEFINE FIELD cellValues.*.*.colors ON TABLE solutionStep TYPE array;
DEFINE FIELD cellValues.*.*.colors.* ON TABLE solutionStep TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;
DEFINE FIELD notes ON TABLE solutionStep TYPE array;
DEFINE FIELD notes.* ON TABLE solutionStep TYPE object;
DEFINE FIELD notes.*.positions ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD notes.*.positions.* ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD notes.*.positions.*.row ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD notes.*.positions.*.column ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD notes.*.color ON TABLE sudoku TYPE string ASSERT $value INSIDE $COLORS;
DEFINE FIELD notes.*.text ON TABLE sudoku TYPE string ASSERT $value != NONE;



DEFINE TABLE walkthrough SCHEMAFULL;

DEFINE FIELD sudoku ON TABLE walkthrough TYPE record(solutionStep);
DEFINE FIELD user ON TABLE walkthrough TYPE record(user);
DEFINE FIELD steps ON TABLE walkthrough TYPE array;
DEFINE FIELD steps.* ON TABLE walkthrough TYPE record(solutionStep);

DEFINE EVENT delete_walkthrough ON TABLE walkthrough WHEN $event = "DELETE" THEN (DELETE FROM $before.steps);
DEFINE EVENT delete_walkthrough ON TABLE walkthrough WHEN $event = "UPDATE" THEN (DELETE FROM array::complement($before.steps, $after.steps));
