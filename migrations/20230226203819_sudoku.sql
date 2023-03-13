DEFINE TABLE sudoku SCHEMAFULL 
  PERMISSIONS
    FOR select WHERE published = true OR ($scope = 'user' AND id = $auth.id)
    FOR delete, update, create WHERE $scope = 'admin' OR ($scope = 'user' AND user = $auth.id);

DEFINE PARAM $COLORS VALUE ['Black', 'White', 'LightGray', 'Gray', 'Orange', 'Purple', 'Red', 'Yellow', 'Green', 'Blue'];

DEFINE FIELD user ON TABLE sudoku TYPE record(user);
DEFINE FIELD title ON TABLE sudoku TYPE string ASSERT $value != NONE;
DEFINE FIELD description ON TABLE sudoku TYPE string ASSERT $value != NONE;
DEFINE FIELD upvotes ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD publicSince ON TABLE sudoku TYPE datetime;
DEFINE FIELD published ON TABLE sudoku VALUE <future> { publicSince != NONE };
DEFINE FIELD labels ON TABLE sudoku TYPE array;
DEFINE FIELD labels.* ON TABLE sudoku TYPE record(label);

DEFINE FIELD dimensions ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD dimensions.rows ON TABLE sudoku TYPE int ASSERT $value >= 1 AND $value <= 36;
DEFINE FIELD dimensions.columns ON TABLE sudoku TYPE int ASSERT $value >= 1 AND $value <= 36;
DEFINE FIELD dimensions.margins ON TABLE sudoku TYPE object;
DEFINE FIELD dimensions.margins.left ON TABLE sudoku TYPE int ASSERT $value >= 0 AND $value <= 10;
DEFINE FIELD dimensions.margins.right ON TABLE sudoku TYPE int ASSERT $value >= 0 AND $value <= 10;
DEFINE FIELD dimensions.margins.top ON TABLE sudoku TYPE int ASSERT $value >= 0 AND $value <= 10;
DEFINE FIELD dimensions.margins.bottom ON TABLE sudoku TYPE int ASSERT $value >= 0 AND $value <= 10;

DEFINE FIELD cells ON TABLE sudoku TYPE array;
DEFINE FIELD cells.* ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD cells.*.* ON TABLE sudoku TYPE bool ASSERT $value != NONE;

DEFINE FIELD givens ON TABLE sudoku TYPE array;
DEFINE FIELD givens.* ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD givens.*.* ON TABLE sudoku TYPE string ASSERT $value != NONE;

DEFINE FIELD colors ON TABLE sudoku TYPE array;
DEFINE FIELD colors.* ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD colors.*.* ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;

DEFINE FIELD regions ON TABLE sudoku TYPE array;
DEFINE FIELD regions.* ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD regions.*.positions ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD regions.*.positions.* ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD regions.*.positions.*.row ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD regions.*.positions.*.column ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD regions.*.type ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Normal', 'Extra', 'Clone', 'MagicSquare'];
DEFINE FIELD regions.*.color ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;
DEFINE FIELD regions.*.borders ON TABLE sudoku TYPE bool;
DEFINE FIELD regions.*.uniqueDigits ON TABLE sudoku TYPE bool;

DEFINE FIELD cages ON TABLE sudoku TYPE array;
DEFINE FIELD cages.* ON TABLE sudoku TYPE object;
DEFINE FIELD cages.*.positions ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD cages.*.positions.* ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD cages.*.positions.*.row ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD cages.*.positions.*.column ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD cages.*.type ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ["Killer"];
DEFINE FIELD cages.*.text ON TABLE sudoku TYPE string;
DEFINE FIELD cages.*.color ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;
DEFINE FIELD cages.*.uniqueDigits ON TABLE sudoku TYPE bool;

DEFINE FIELD paths ON TABLE sudoku TYPE array;
DEFINE FIELD paths.* ON TABLE sudoku TYPE object;
DEFINE FIELD paths.*.positions ON TABLE sudoku TYPE array ASSERT $value != NONE;
DEFINE FIELD paths.*.positions.* ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD paths.*.positions.*.row ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD paths.*.positions.*.column ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD paths.*.type ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Arrow', 'Thermo', 'Between', 'Lockout', 'Renban', 'Whisper', 'Palindrome', 'AntiFactor', 'EqualSum', 'ProductSum', 'Entropic', 'Odd', 'Even', 'Pill'];
DEFINE FIELD paths.*.color ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;
DEFINE FIELD paths.*.width ON TABLE sudoku TYPE int;
DEFINE FIELD paths.*.form ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Square', 'Round', 'Diamond'];
DEFINE FIELD paths.*.fill ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Solid', 'Hollow'];
DEFINE FIELD paths.*.arrow ON TABLE sudoku TYPE bool;
DEFINE FIELD paths.*.uniqueDigits ON TABLE sudoku TYPE bool;

DEFINE FIELD borderclues ON TABLE sudoku TYPE array;
DEFINE FIELD borderclues.* ON TABLE sudoku TYPE object;
DEFINE FIELD borderclues.*.positions ON TABLE sudoku TYPE array ASSERT array::len($value) = 2;
DEFINE FIELD borderclues.*.positions.* ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD borderclues.*.positions.*.row ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD borderclues.*.positions.*.column ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD borderclues.*.type ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['KropkiWhite', 'KropkiBlack', 'XvX', 'XvV', 'Inequality', 'Quadruple', 'Border'];
DEFINE FIELD borderclues.*.shape ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Circle', 'Square', 'Diamond', 'Star', 'Line'];
DEFINE FIELD borderclues.*.color ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;
DEFINE FIELD borderclues.*.radius ON TABLE sudoku TYPE int;
DEFINE FIELD borderclues.*.text ON TABLE sudoku TYPE string;

DEFINE FIELD cellclues ON TABLE sudoku TYPE array;
DEFINE FIELD cellclues.* ON TABLE sudoku TYPE object;
DEFINE FIELD cellclues.*.position ON TABLE sudoku TYPE object ASSERT $value != NONE;
DEFINE FIELD cellclues.*.position.row ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD cellclues.*.position.column ON TABLE sudoku TYPE int ASSERT $value != NONE;
DEFINE FIELD cellclues.*.type ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Maximum', 'Minimum', 'LittleKillerNE', 'LittleKillerSE', 'LittleKillerSW', 'LittleKillerNW', 'Sandwich', 'Skyscraper', 'XSum', 'NumberedRoom'];
DEFINE FIELD cellclues.*.location ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['TopLeft', 'Top', 'TopRight', 'Left', 'Center', 'Right', 'BottomLeft', 'Bottom', 'BottomRight'];
DEFINE FIELD cellclues.*.text ON TABLE sudoku TYPE string;
DEFINE FIELD cellclues.*.size ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Large', 'Medium', 'Small', 'XSmall'];
DEFINE FIELD cellclues.*.symbol ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Arrowhead', 'InvertedArrowhead', 'Arrow', 'SmallArrow', 'Diagonal'];
DEFINE FIELD cellclues.*.rotation ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest'];
DEFINE FIELD cellclues.*.color ON TABLE sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS;

DEFINE FIELD logic ON TABLE sudoku TYPE object;
DEFINE FIELD logic.digits ON TABLE sudoku TYPE string;
DEFINE FIELD logic.flags ON TABLE sudoku TYPE array;
DEFINE FIELD logic.flags.* ON TABLE sudoku TYPE string ASSERT $value INSIDE ['NonStandard', 'DiagonalPos', 'DiagonalNeg', 'Antiknight', 'Antiking', 'Nonconsecutive', 'DisjointSets', 'SCells', 'Entropy', 'Indexed159', 'NegativeX', 'NegativeV', 'NegativeBlack', 'NegativeWhite'];

DEFINE FIELD created ON TABLE sudoku TYPE datetime VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE sudoku TYPE datetime VALUE time::now();
