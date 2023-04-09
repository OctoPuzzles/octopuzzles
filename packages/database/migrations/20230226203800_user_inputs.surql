DEFINE TABLE userInputs SCHEMAFULL
    PERMISSIONS 
        FOR select, delete, update, create NONE;

DEFINE PARAM $COLORS VALUE ['Black', 'White', 'LightGray', 'Gray', 'Orange', 'Purple', 'Red', 'Yellow', 'Green', 'Blue'];

DEFINE FIELD cellValues ON TABLE userInputs TYPE array;
DEFINE FIELD cellValues.* ON TABLE userInputs TYPE array;
DEFINE FIELD cellValues.*.* ON TABLE userInputs TYPE object;
DEFINE FIELD cellValues.*.*.digits ON TABLE userInputs TYPE array;
DEFINE FIELD cellValues.*.*.digits.* ON TABLE userInputs TYPE string;
DEFINE FIELD cellValues.*.*.cornermarks ON TABLE userInputs TYPE array;
DEFINE FIELD cellValues.*.*.cornermarks.* ON TABLE userInputs TYPE string;
DEFINE FIELD cellValues.*.*.centermarks ON TABLE userInputs TYPE array;
DEFINE FIELD cellValues.*.*.centermarks.* ON TABLE userInputs TYPE string;
DEFINE FIELD cellValues.*.*.colors ON TABLE userInputs TYPE array;
DEFINE FIELD cellValues.*.*.colors.* ON TABLE userInputs TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;
DEFINE FIELD notes ON TABLE userInputs TYPE array;
DEFINE FIELD notes.* ON TABLE userInputs TYPE object;
DEFINE FIELD notes.*.positions ON TABLE userInputs TYPE array ASSERT $value != NONE;
DEFINE FIELD notes.*.positions.* ON TABLE userInputs TYPE object ASSERT $value != NONE;
DEFINE FIELD notes.*.positions.*.row ON TABLE userInputs TYPE int ASSERT $value != NONE;
DEFINE FIELD notes.*.positions.*.column ON TABLE userInputs TYPE int ASSERT $value != NONE;
DEFINE FIELD notes.*.color ON TABLE userInputs TYPE string ASSERT $value INSIDE $COLORS;
DEFINE FIELD notes.*.text ON TABLE userInputs TYPE string ASSERT $value != NONE;