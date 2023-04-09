import Surreal from 'surrealdb.js';

type Join<K, P> = K extends string | number
    ? P extends string | number
    ? `${K}${'' extends P ? '' : '/'}${P}`
    : never
    : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Paths<T, D extends number = 5> = [D] extends [never]
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
    : '';

type PropType<T, Path extends string> = string extends Path
    ? unknown
    : Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}/${infer R}`
    ? K extends keyof T
    ? PropType<T[K], R>
    : unknown
    : unknown;

type PathAndValue<T extends Record<string, unknown>> = {
    [Path in Paths<T>]: {
        path: `/${Path}`;
        value: PropType<T, Path>; // TODO: Partial or DeepPartial or not
    };
}[Paths<T>];

/** SURREALX VERSION OF SURREAL PATCH */
type AddPatchX<T extends Record<string, unknown>> = {
    op: 'add';
} & PathAndValue<T>;
type RemovePatchX<T extends Record<string, unknown>> = {
    op: 'remove';
    path: Paths<T>;
};
type ReplacePatchX<T extends Record<string, unknown>> = {
    op: 'replace';
} & PathAndValue<T>;
type ChangePatchX<T extends Record<string, unknown>> = {
    op: 'change';
} & PathAndValue<T>;
type PatchX<T extends Record<string, unknown>> =
    | AddPatchX<T>
    | RemovePatchX<T>
    | ReplacePatchX<T>
    | ChangePatchX<T>;

export type Id<N extends string> = `${N}:${string}`;
export type WithId<T, N extends string> = T & { id: Id<N> };

type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
/**
 * Definition:
 * ```sql
 * DEFINE TABLE commented SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE ($scope = 'user' AND user = $auth.id)
 * ```
*/
export type Commented = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD body ON commented TYPE string ASSERT $value != NONE
     * ```
    */
    body: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD in ON commented TYPE record(user) ASSERT $value != NONE
     * ```
    */
    in: Id<"user">;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD out ON commented TYPE record(sudoku) ASSERT $value != NONE
     * ```
    */
    out: Id<"sudoku">;
};
/**
 * Definition:
 * ```sql
 * DEFINE TABLE label SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete NONE
 * ```
*/
export type Label = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD description ON label TYPE string ASSERT $value != NONE
     * ```
    */
    description: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD name ON label TYPE string ASSERT $value != NONE
     * ```
    */
    name: string;
};
/**
 * Definition:
 * ```sql
 * DEFINE TABLE sudoku SCHEMAFULL PERMISSIONS FOR select WHERE published = true OR ($scope = 'user' AND id = $auth.id), FOR create, update, delete WHERE ($scope = 'user' AND user = $auth.id)
 * ```
*/
export type Sudoku = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD borderclues ON sudoku TYPE array
     * ```
    */
    borderclues?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD borderclues[*].color ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS
         * ```
        */
        color?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD borderclues[*].positions ON sudoku TYPE array ASSERT array::len($value) = 2
         * ```
        */
        positions?: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD borderclues[*].positions[*].column ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            column: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD borderclues[*].positions[*].row ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            row: number;
        }[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD borderclues[*].radius ON sudoku TYPE int
         * ```
        */
        radius?: number;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD borderclues[*].shape ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Circle', 'Square', 'Diamond', 'Star', 'Line']
         * ```
        */
        shape?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD borderclues[*].text ON sudoku TYPE string
         * ```
        */
        text?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD borderclues[*].type ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['KropkiWhite', 'KropkiBlack', 'XvX', 'XvV', 'Inequality', 'Quadruple', 'Border']
         * ```
        */
        type?: string;
    }[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD cages ON sudoku TYPE array
     * ```
    */
    cages?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cages[*].color ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS
         * ```
        */
        color?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cages[*].positions ON sudoku TYPE array ASSERT $value != NONE
         * ```
        */
        positions: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD cages[*].positions[*].column ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            column: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD cages[*].positions[*].row ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            row: number;
        }[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cages[*].text ON sudoku TYPE string
         * ```
        */
        text?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cages[*].type ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Killer']
         * ```
        */
        type?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cages[*].uniqueDigits ON sudoku TYPE bool
         * ```
        */
        uniqueDigits?: boolean;
    }[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD cellclues ON sudoku TYPE array
     * ```
    */
    cellclues?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].color ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS
         * ```
        */
        color?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].location ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['TopLeft', 'Top', 'TopRight', 'Left', 'Center', 'Right', 'BottomLeft', 'Bottom', 'BottomRight']
         * ```
        */
        location?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].position ON sudoku TYPE object ASSERT $value != NONE
         * ```
        */
        position: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD cellclues[*].position.column ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            column: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD cellclues[*].position.row ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            row: number;
        };
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].rotation ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest']
         * ```
        */
        rotation?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].size ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Large', 'Medium', 'Small', 'XSmall']
         * ```
        */
        size?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].symbol ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Arrowhead', 'InvertedArrowhead', 'Arrow', 'SmallArrow', 'Diagonal']
         * ```
        */
        symbol?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].text ON sudoku TYPE string
         * ```
        */
        text?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellclues[*].type ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Maximum', 'Minimum', 'LittleKillerNE', 'LittleKillerSE', 'LittleKillerSW', 'LittleKillerNW', 'Sandwich', 'Skyscraper', 'XSum', 'NumberedRoom']
         * ```
        */
        type?: string;
    }[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD cells ON sudoku TYPE array
     * ```
    */
    cells?: boolean[][];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD colors ON sudoku TYPE array
     * ```
    */
    colors?: string[][];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD created ON sudoku TYPE datetime VALUE $before OR time::now()
     * ```
    */
    created?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD description ON sudoku TYPE string ASSERT $value != NONE
     * ```
    */
    description: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD dimensions ON sudoku TYPE object ASSERT $value != NONE
     * ```
    */
    dimensions: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD dimensions.columns ON sudoku TYPE int ASSERT $value >= 1 AND $value <= 36
         * ```
        */
        columns?: number;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD dimensions.margins ON sudoku TYPE object
         * ```
        */
        margins?: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD dimensions.margins.bottom ON sudoku TYPE int ASSERT $value >= 0 AND $value <= 10
             * ```
            */
            bottom?: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD dimensions.margins.left ON sudoku TYPE int ASSERT $value >= 0 AND $value <= 10
             * ```
            */
            left?: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD dimensions.margins.right ON sudoku TYPE int ASSERT $value >= 0 AND $value <= 10
             * ```
            */
            right?: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD dimensions.margins.top ON sudoku TYPE int ASSERT $value >= 0 AND $value <= 10
             * ```
            */
            top?: number;
        };
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD dimensions.rows ON sudoku TYPE int ASSERT $value >= 1 AND $value <= 36
         * ```
        */
        rows?: number;
    };
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD givens ON sudoku TYPE array
     * ```
    */
    givens?: string[][];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD labels ON sudoku TYPE array
     * ```
    */
    labels?: Id<"label">[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD logic ON sudoku TYPE object
     * ```
    */
    logic?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD logic.digits ON sudoku TYPE string
         * ```
        */
        digits?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD logic.flags ON sudoku TYPE array
         * ```
        */
        flags?: string[];
    };
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD paths ON sudoku TYPE array
     * ```
    */
    paths?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].arrow ON sudoku TYPE bool
         * ```
        */
        arrow?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].color ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS
         * ```
        */
        color?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].fill ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Solid', 'Hollow']
         * ```
        */
        fill?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].form ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Square', 'Round', 'Diamond']
         * ```
        */
        form?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].positions ON sudoku TYPE array ASSERT $value != NONE
         * ```
        */
        positions: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD paths[*].positions[*].column ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            column: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD paths[*].positions[*].row ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            row: number;
        }[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].type ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Arrow', 'Thermo', 'Between', 'Lockout', 'Renban', 'Whisper', 'Palindrome', 'AntiFactor', 'EqualSum', 'ProductSum', 'Entropic', 'Odd', 'Even', 'Pill']
         * ```
        */
        type?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].uniqueDigits ON sudoku TYPE bool
         * ```
        */
        uniqueDigits?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD paths[*].width ON sudoku TYPE int
         * ```
        */
        width?: number;
    }[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD publicSince ON sudoku TYPE datetime
     * ```
    */
    publicSince?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD published ON sudoku VALUE <future> { publicSince != NONE }
     * ```
    */
    published?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD regions ON sudoku TYPE array
     * ```
    */
    regions?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD regions[*].borders ON sudoku TYPE bool
         * ```
        */
        borders?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD regions[*].color ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE $COLORS
         * ```
        */
        color?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD regions[*].positions ON sudoku TYPE array ASSERT $value != NONE
         * ```
        */
        positions: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD regions[*].positions[*].column ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            column: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD regions[*].positions[*].row ON sudoku TYPE int ASSERT $value != NONE
             * ```
            */
            row: number;
        }[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD regions[*].type ON sudoku TYPE string ASSERT $value = NONE OR $value INSIDE ['Normal', 'Extra', 'Clone', 'MagicSquare']
         * ```
        */
        type?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD regions[*].uniqueDigits ON sudoku TYPE bool
         * ```
        */
        uniqueDigits?: boolean;
    }[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD solution ON sudoku TYPE record(userInputs)
     * ```
    */
    solution?: Id<"userInputs">;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD title ON sudoku TYPE string ASSERT $value != NONE
     * ```
    */
    title: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD updated ON sudoku TYPE datetime VALUE time::now()
     * ```
    */
    updated?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD upvotes ON sudoku TYPE int ASSERT $value != NONE
     * ```
    */
    upvotes: number;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD user ON sudoku TYPE record(user)
     * ```
    */
    user?: Id<"user">;
};
/**
 * Definition:
 * ```sql
 * DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select FULL, FOR create NONE, FOR update, delete WHERE ($scope = 'user' AND id = $auth.id)
 * ```
*/
export type User = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD created ON user TYPE datetime VALUE $before OR time::now()
     * ```
    */
    created?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD email ON user TYPE string ASSERT is::email($value) PERMISSIONS FOR select WHERE ($scope = 'user' AND id = $auth.id), FOR create, update, delete FULL
     * ```
    */
    email?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD password ON user TYPE string ASSERT $value != NONE PERMISSIONS NONE
     * ```
    */
    password: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD settings ON user TYPE object PERMISSIONS FOR select WHERE ($scope = 'user' AND id = $auth.id), FOR create, update, delete FULL
     * ```
    */
    settings?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.autoScan ON user TYPE bool
         * ```
        */
        autoScan?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.highlightMode ON user TYPE string ASSERT $value = NONE OR $value INSIDE ['None', 'Seen', 'Tuples']
         * ```
        */
        highlightMode?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.mode ON user TYPE string ASSERT $value = NONE OR $value INSIDE ['Basic', 'Advanced', 'Extreme']
         * ```
        */
        mode?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanAntiKing ON user TYPE bool
         * ```
        */
        scanAntiKing?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanAntiKnight ON user TYPE bool
         * ```
        */
        scanAntiKnight?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanCages ON user TYPE bool
         * ```
        */
        scanCages?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanDiagonals ON user TYPE bool
         * ```
        */
        scanDiagonals?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanDisjointSets ON user TYPE bool
         * ```
        */
        scanDisjointSets?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanExtraRegions ON user TYPE bool
         * ```
        */
        scanExtraRegions?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanNegativeKropki ON user TYPE bool
         * ```
        */
        scanNegativeKropki?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanNegativeXV ON user TYPE bool
         * ```
        */
        scanNegativeXV?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanNonConsecutive ON user TYPE bool
         * ```
        */
        scanNonConsecutive?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scanPaths ON user TYPE bool
         * ```
        */
        scanPaths?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.scannerSpeed ON user TYPE string ASSERT $value = NONE OR $value INSIDE ['Slow', 'Fast', 'Instant']
         * ```
        */
        scannerSpeed?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.useCenterMarks ON user TYPE bool
         * ```
        */
        useCenterMarks?: boolean;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD settings.useCornerMarks ON user TYPE bool
         * ```
        */
        useCornerMarks?: boolean;
    };
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD updated ON user TYPE datetime VALUE time::now()
     * ```
    */
    updated?: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD username ON user TYPE string ASSERT $value != NONE AND $value = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/ AND string::len($value) <= 32
     * ```
    */
    username: string;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD verified ON user TYPE bool VALUE $value OR false PERMISSIONS NONE
     * ```
    */
    verified?: boolean;
};
/**
 * Definition:
 * ```sql
 * DEFINE TABLE userInputs SCHEMAFULL PERMISSIONS NONE
 * ```
*/
export type UserInputs = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD cellValues ON userInputs TYPE array
     * ```
    */
    cellValues?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellValues[*][*].centermarks ON userInputs TYPE array
         * ```
        */
        centermarks?: string[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellValues[*][*].colors ON userInputs TYPE array
         * ```
        */
        colors?: string[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellValues[*][*].cornermarks ON userInputs TYPE array
         * ```
        */
        cornermarks?: string[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD cellValues[*][*].digits ON userInputs TYPE array
         * ```
        */
        digits?: string[];
    }[][];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD notes ON userInputs TYPE array
     * ```
    */
    notes?: {
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD notes[*].color ON userInputs TYPE string ASSERT $value INSIDE $COLORS
         * ```
        */
        color?: string;
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD notes[*].positions ON userInputs TYPE array ASSERT $value != NONE
         * ```
        */
        positions: {
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD notes[*].positions[*].column ON userInputs TYPE int ASSERT $value != NONE
             * ```
            */
            column: number;
            /**
             * Definition:
             * ```sql
             * DEFINE FIELD notes[*].positions[*].row ON userInputs TYPE int ASSERT $value != NONE
             * ```
            */
            row: number;
        }[];
        /**
         * Definition:
         * ```sql
         * DEFINE FIELD notes[*].text ON userInputs TYPE string ASSERT $value != NONE
         * ```
        */
        text: string;
    }[];
};
/**
 * Definition:
 * ```sql
 * DEFINE TABLE vote SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE ($scope = 'user' AND user = $auth.id)
 * ```
*/
export type Vote = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD in ON vote TYPE record(user) ASSERT $value != NONE
     * ```
    */
    in: Id<"user">;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD out ON vote TYPE record(sudoku) ASSERT $value != NONE
     * ```
    */
    out: Id<"sudoku">;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD val ON vote TYPE int ASSERT $value = 1 OR $value = -1
     * ```
    */
    val?: number;
};
/**
 * Definition:
 * ```sql
 * DEFINE TABLE walkthrough SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE ($scope = 'user' AND user = $auth.id)
 * ```
*/
export type Walkthrough = {
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD steps ON walkthrough TYPE array
     * ```
    */
    steps?: Id<"userInputs">[];
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD sudoku ON walkthrough TYPE record(sudoku)
     * ```
    */
    sudoku?: Id<"sudoku">;
    /**
     * Definition:
     * ```sql
     * DEFINE FIELD user ON walkthrough TYPE record(user)
     * ```
    */
    user?: Id<"user">;
};
/**
 * Names of tables in the database
*/
export type TableName = "commented" | "label" | "sudoku" | "user" | "userInputs" | "vote" | "walkthrough";
interface TableTypes extends Record<TableName, Record<string, unknown>> {
    commented: Commented;
    label: Label;
    sudoku: Sudoku;
    user: User;
    userInputs: UserInputs;
    vote: Vote;
    walkthrough: Walkthrough;
}

export class SurrealX extends Surreal {
    /**
     * Initializee a SurrealDb.
     *
     * @param url The url of the database endpoint to connect to.
     *
     * @param token The authorization token.
     */
    constructor(url?: string | undefined, token?: string | undefined) {
        super(url, token);
    }

    /**
     * Selects all records in a table from the database.
     *
     * @param thing The table name to select.
     */
    async selectAllX<T extends TableName>(
        thing: T
    ): Promise<WithId<TableTypes[T], T>[]> {
        return await super.select(thing);
    }

    /**
     * Selects a specific record from the database.
     *
     * @param thing The record ID to select.
     */
    async selectX<T extends TableName>(
        thing: Id<T>
    ): Promise<WithId<TableTypes[T], T> | undefined> {
        const result = await super.select(thing);
        return result[0] as any;
    }

    /**
     * Creates a record in the database.
     *
     * @param thing The table name or the specific record ID to create.
     *
     * @param data The document / record data to insert.
     *
     * @example
     * ```
     * // Create an article with a random ID
     * let article = await db.create('article');
     * // Create an article with a specific ID
     * let article = await db.create('article:h5wxrf2ewk8xjxosxtyc', {...});
     * ```
     */
    async createX<T extends TableName>(
        thing: T | Id<T>,
        data: TableTypes[T]
    ): Promise<WithId<TableTypes[T], T>> {
        return await super.create(thing, data) as any;
    }

    /**
     * Updates all records in a table, or a specific record, in the database.
     *
     * NOTE: This function replaces the current document / record data with the specified data.
     *
     * @param thing — The table name or the specific record ID to update.
     *
     * @param data — The document / record data to insert.
     */
    async updateAllX<T extends TableName>(
        thing: T,
        data: TableTypes[T]
    ): Promise<WithId<TableTypes[T], T>[]> {
        return (await super.update(thing, data)) as any;
    }

    /**
     * Updates all records in a table, or a specific record, in the database.
     *
     * NOTE: This function replaces the current document / record data with the specified data.
     *
     * @param thing — The table name or the specific record ID to update.
     *
     * @param data — The document / record data to insert.
     */
    async updateX<T extends TableName>(
        thing: Id<T>,
        data: TableTypes[T]
    ): Promise<WithId<TableTypes[T], T>> {
        return await super.update(thing, data) as any;
    }

    /**
     * Modifies all records in a table, or a specific record, in the database.
     *
     * NOTE: This function merges the current document / record data with the specified data.
     *
     * @param thing The table name or the specific record ID to change.
     *
     * @param data The document / record data to insert.
     */
    async changeX<T extends TableName>(
        thing: T | Id<T>,
        data: DeepPartial<TableTypes[T]>
    ): Promise<WithId<TableTypes[T], T>> {
        return (await super.change(thing, data as any)) as any;
    }

    /**
     * Deletes all records in a table, or a specific record, from the database.
     *
     * @param thing The table name or a record ID to select.
     */
    async deleteAllX<T extends TableName>(thing: T): Promise<void> {
        return await super.delete(thing);
    }

    /**
     * Deletes all records in a table, or a specific record, from the database.
     *
     * @param thing The table name or a record ID to select.
     */
    async deleteX<T extends TableName>(thing: Id<T>): Promise<void> {
        return await super.delete(thing);
    }

    /**
     * Applies JSON Patch changes to all records in the database.
     *
     * NOTE: This function patches the current document / record data with the specified JSON Patch data.
     *
     * @param thing — The table name to modify.
     *
     * @param data — The JSON Patch data with which to modify the records.
     */
    async modifyAllX<T extends TableName>(
        thing: T,
        data?: PatchX<TableTypes[T]>[] | undefined
    ): Promise<PatchX<TableTypes[T]>[][]> {
        return (await super.modify(thing, data as any)) as any;
    }

    /**
     * Applies JSON Patch changes to a specific record in the database.
     *
     * NOTE: This function patches the current document / record data with the specified JSON Patch data.
     *
     * @param thing — The specific record ID to modify.
     *
     * @param data — The JSON Patch data with which to modify the records.
     */
    async modifyX<T extends TableName>(
        thing: Id<T>,
        data?: PatchX<TableTypes[T]>[] | undefined
    ): Promise<PatchX<TableTypes[T]>[]> {
        return (await super.modify(thing, data as any)) as any;
    }
}
