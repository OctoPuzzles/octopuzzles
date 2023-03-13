DEFINE SCOPE user 
    SIGNIN ( SELECT * FROM user WHERE (email = $identifier OR username = $identifier) AND crypto::argon2::compare(password, $password) );

DEFINE SCOPE admin SESSION 1h
    SIGNIN ( SELECT * FROM user WHERE isAdmin = true AND email = $identifier AND crypto::argon2::compare(password, $password) );

DEFINE TABLE user SCHEMAFULL 
  PERMISSIONS 
    FOR select, update WHERE ($scope = 'user' && id = $auth.id) 
      OR $scope = 'admin'
    FOR delete WHERE ($scope = 'user' && id = $auth.id) OR $scope = 'admin' 
    FOR create WHERE $scope = 'admin';

DEFINE FIELD email ON TABLE user TYPE string ASSERT is::email($value);
DEFINE FIELD username ON TABLE user TYPE string ASSERT $value != NONE AND $value = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/ AND string::length($value) <= 32;
DEFINE FIELD password ON TABLE user TYPE string ASSERT $value != NONE
  PERMISSIONS NONE;

DEFINE FIELD settings ON TABLE user TYPE object;
DEFINE FIELD settings.highlightMode ON TABLE user TYPE string ASSERT $value = NONE OR $value INSIDE ['None', 'Seen', 'Tuples'];
DEFINE FIELD settings.mode ON TABLE user TYPE string ASSERT $value = NONE OR $value INSIDE ['Basic', 'Advanced', 'Extreme'];
DEFINE FIELD settings.scannerSpeed ON TABLE user TYPE string ASSERT $value = NONE OR $value INSIDE ['Slow', 'Fast', 'Instant'];
DEFINE FIELD settings.autoScan ON TABLE user TYPE bool;
DEFINE FIELD settings.useCenterMarks ON TABLE user TYPE bool;
DEFINE FIELD settings.useCornerMarks ON TABLE user TYPE bool;
DEFINE FIELD settings.scanDiagonals ON TABLE user TYPE bool;
DEFINE FIELD settings.scanAntiKnight ON TABLE user TYPE bool;
DEFINE FIELD settings.scanAntiKing ON TABLE user TYPE bool;
DEFINE FIELD settings.scanDisjointSets ON TABLE user TYPE bool;
DEFINE FIELD settings.scanCages ON TABLE user TYPE bool;
DEFINE FIELD settings.scanPaths ON TABLE user TYPE bool;
DEFINE FIELD settings.scanExtraRegions ON TABLE user TYPE bool;
DEFINE FIELD settings.scanNegativeXV ON TABLE user TYPE bool;
DEFINE FIELD settings.scanNegativeKropki ON TABLE user TYPE bool;
DEFINE FIELD settings.scanNonConsecutive ON TABLE user TYPE bool;
    
DEFINE FIELD verified ON TABLE user TYPE bool VALUE $value OR false
    PERMISSIONS NONE;
DEFINE FIELD created ON TABLE user TYPE datetime VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE user TYPE datetime VALUE time::now();

DEFINE INDEX email ON TABLE user COLUMNS email UNIQUE;
DEFINE INDEX username ON TABLE user COLUMNS username UNIQUE;

