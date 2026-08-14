var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except2, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except2)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .wrangler/tmp/bundle-O98dHm/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-O98dHm/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../node_modules/.pnpm/wrangler@4.122.0_@cloudflare+workers-types@5.20260813.1/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/.pnpm/wrangler@4.122.0_@cloudflare+workers-types@5.20260813.1/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/entity.js
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
var entityKind;
var init_entity = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/entity.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    entityKind = /* @__PURE__ */ Symbol.for("drizzle:entityKind");
    __name(is, "is");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.utils.js
var TableName;
var init_table_utils = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    TableName = /* @__PURE__ */ Symbol.for("drizzle:Name");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.js
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}
var Schema, Columns, ExtraConfigColumns, OriginalName, BaseName, IsAlias, ExtraConfigBuilder, IsDrizzleTable, Table;
var init_table = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table_utils();
    Schema = /* @__PURE__ */ Symbol.for("drizzle:Schema");
    Columns = /* @__PURE__ */ Symbol.for("drizzle:Columns");
    ExtraConfigColumns = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigColumns");
    OriginalName = /* @__PURE__ */ Symbol.for("drizzle:OriginalName");
    BaseName = /* @__PURE__ */ Symbol.for("drizzle:BaseName");
    IsAlias = /* @__PURE__ */ Symbol.for("drizzle:IsAlias");
    ExtraConfigBuilder = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigBuilder");
    IsDrizzleTable = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleTable");
    Table = class {
      static {
        __name(this, "Table");
      }
      static [entityKind] = "Table";
      /** @internal */
      static Symbol = {
        Name: TableName,
        Schema,
        OriginalName,
        Columns,
        ExtraConfigColumns,
        BaseName,
        IsAlias,
        ExtraConfigBuilder
      };
      /**
       * @internal
       * Can be changed if the table is aliased.
       */
      [TableName];
      /**
       * @internal
       * Used to store the original name of the table, before any aliasing.
       */
      [OriginalName];
      /** @internal */
      [Schema];
      /** @internal */
      [Columns];
      /** @internal */
      [ExtraConfigColumns];
      /**
       *  @internal
       * Used to store the table name before the transformation via the `tableCreator` functions.
       */
      [BaseName];
      /** @internal */
      [IsAlias] = false;
      /** @internal */
      [IsDrizzleTable] = true;
      /** @internal */
      [ExtraConfigBuilder] = void 0;
      constructor(name, schema, baseName) {
        this[TableName] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
      }
    };
    __name(getTableName, "getTableName");
    __name(getTableUniqueName, "getTableUniqueName");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column.js
var Column;
var init_column = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    Column = class {
      static {
        __name(this, "Column");
      }
      constructor(table, config) {
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.keyAsName = config.keyAsName;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.onUpdateFn = config.onUpdateFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
        this.generated = config.generated;
        this.generatedIdentity = config.generatedIdentity;
      }
      static [entityKind] = "Column";
      name;
      keyAsName;
      primary;
      notNull;
      default;
      defaultFn;
      onUpdateFn;
      hasDefault;
      isUnique;
      uniqueName;
      uniqueType;
      dataType;
      columnType;
      enumValues = void 0;
      generated = void 0;
      generatedIdentity = void 0;
      config;
      mapFromDriverValue(value) {
        return value;
      }
      mapToDriverValue(value) {
        return value;
      }
      // ** @internal */
      shouldDisableInsert() {
        return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder;
var init_column_builder = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column-builder.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    ColumnBuilder = class {
      static {
        __name(this, "ColumnBuilder");
      }
      static [entityKind] = "ColumnBuilder";
      config;
      constructor(name, dataType, columnType) {
        this.config = {
          name,
          keyAsName: name === "",
          notNull: false,
          default: void 0,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          uniqueName: void 0,
          uniqueType: void 0,
          dataType,
          columnType,
          generated: void 0
        };
      }
      /**
       * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
       *
       * @example
       * ```ts
       * const users = pgTable('users', {
       * 	id: integer('id').$type<UserId>().primaryKey(),
       * 	details: json('details').$type<UserDetails>().notNull(),
       * });
       * ```
       */
      $type() {
        return this;
      }
      /**
       * Adds a `not null` clause to the column definition.
       *
       * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
       */
      notNull() {
        this.config.notNull = true;
        return this;
      }
      /**
       * Adds a `default <value>` clause to the column definition.
       *
       * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
       *
       * If you need to set a dynamic default value, use {@link $defaultFn} instead.
       */
      default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Adds a dynamic default value to the column.
       * The function will be called when the row is inserted, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $defaultFn}.
       */
      $default = this.$defaultFn;
      /**
       * Adds a dynamic update value to the column.
       * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
       * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $onUpdateFn(fn) {
        this.config.onUpdateFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $onUpdateFn}.
       */
      $onUpdate = this.$onUpdateFn;
      /**
       * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
       *
       * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
       */
      primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
      }
      /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
      setName(name) {
        if (this.config.name !== "") return;
        this.config.name = name;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder, ForeignKey;
var init_foreign_keys = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/foreign-keys.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table_utils();
    ForeignKeyBuilder = class {
      static {
        __name(this, "ForeignKeyBuilder");
      }
      static [entityKind] = "PgForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate = "no action";
      /** @internal */
      _onDelete = "no action";
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action === void 0 ? "no action" : action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action === void 0 ? "no action" : action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey(table, this);
      }
    };
    ForeignKey = class {
      static {
        __name(this, "ForeignKey");
      }
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [entityKind] = "PgForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[TableName],
          ...columnNames,
          foreignColumns[0].table[TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}
var init_tracing_utils = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing-utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(iife, "iife");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder, UniqueOnConstraintBuilder, UniqueConstraint;
var init_unique_constraint = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/unique-constraint.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table_utils();
    __name(uniqueKeyName, "uniqueKeyName");
    UniqueConstraintBuilder = class {
      static {
        __name(this, "UniqueConstraintBuilder");
      }
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [entityKind] = "PgUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      nullsNotDistinctConfig = false;
      nullsNotDistinct() {
        this.nullsNotDistinctConfig = true;
        return this;
      }
      /** @internal */
      build(table) {
        return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
      }
    };
    UniqueOnConstraintBuilder = class {
      static {
        __name(this, "UniqueOnConstraintBuilder");
      }
      static [entityKind] = "PgUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
      }
    };
    UniqueConstraint = class {
      static {
        __name(this, "UniqueConstraint");
      }
      constructor(table, columns, nullsNotDistinct, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
        this.nullsNotDistinct = nullsNotDistinct;
      }
      static [entityKind] = "PgUniqueConstraint";
      columns;
      name;
      nullsNotDistinct = false;
      getName() {
        return this.name;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
var init_array = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/utils/array.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(parsePgArrayValue, "parsePgArrayValue");
    __name(parsePgNestedArray, "parsePgNestedArray");
    __name(parsePgArray, "parsePgArray");
    __name(makePgArray, "makePgArray");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder, PgColumn, ExtraConfigColumn, IndexedColumn, PgArrayBuilder, PgArray;
var init_common = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/common.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_column_builder();
    init_column();
    init_entity();
    init_foreign_keys();
    init_tracing_utils();
    init_unique_constraint();
    init_array();
    PgColumnBuilder = class extends ColumnBuilder {
      static {
        __name(this, "PgColumnBuilder");
      }
      foreignKeyConfigs = [];
      static [entityKind] = "PgColumnBuilder";
      array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
      }
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
      }
      generatedAlwaysAs(as) {
        this.config.generated = {
          as,
          type: "always",
          mode: "stored"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return iife(
            (ref2, actions2) => {
              const builder = new ForeignKeyBuilder(() => {
                const foreignColumn = ref2();
                return { columns: [column], foreignColumns: [foreignColumn] };
              });
              if (actions2.onUpdate) {
                builder.onUpdate(actions2.onUpdate);
              }
              if (actions2.onDelete) {
                builder.onDelete(actions2.onDelete);
              }
              return builder.build(table);
            },
            ref,
            actions
          );
        });
      }
      /** @internal */
      buildExtraConfigColumn(table) {
        return new ExtraConfigColumn(table, this.config);
      }
    };
    PgColumn = class extends Column {
      static {
        __name(this, "PgColumn");
      }
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [entityKind] = "PgColumn";
    };
    ExtraConfigColumn = class extends PgColumn {
      static {
        __name(this, "ExtraConfigColumn");
      }
      static [entityKind] = "ExtraConfigColumn";
      getSQLType() {
        return this.getSQLType();
      }
      indexConfig = {
        order: this.config.order ?? "asc",
        nulls: this.config.nulls ?? "last",
        opClass: this.config.opClass
      };
      defaultConfig = {
        order: "asc",
        nulls: "last",
        opClass: void 0
      };
      asc() {
        this.indexConfig.order = "asc";
        return this;
      }
      desc() {
        this.indexConfig.order = "desc";
        return this;
      }
      nullsFirst() {
        this.indexConfig.nulls = "first";
        return this;
      }
      nullsLast() {
        this.indexConfig.nulls = "last";
        return this;
      }
      /**
       * ### PostgreSQL documentation quote
       *
       * > An operator class with optional parameters can be specified for each column of an index.
       * The operator class identifies the operators to be used by the index for that column.
       * For example, a B-tree index on four-byte integers would use the int4_ops class;
       * this operator class includes comparison functions for four-byte integers.
       * In practice the default operator class for the column's data type is usually sufficient.
       * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
       * For example, we might want to sort a complex-number data type either by absolute value or by real part.
       * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
       * More information about operator classes check:
       *
       * ### Useful links
       * https://www.postgresql.org/docs/current/sql-createindex.html
       *
       * https://www.postgresql.org/docs/current/indexes-opclass.html
       *
       * https://www.postgresql.org/docs/current/xindex.html
       *
       * ### Additional types
       * If you have the `pg_vector` extension installed in your database, you can use the
       * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
       *
       * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
       *
       * @param opClass
       * @returns
       */
      op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
      }
    };
    IndexedColumn = class {
      static {
        __name(this, "IndexedColumn");
      }
      static [entityKind] = "IndexedColumn";
      constructor(name, keyAsName, type, indexConfig) {
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
      }
      name;
      keyAsName;
      type;
      indexConfig;
    };
    PgArrayBuilder = class extends PgColumnBuilder {
      static {
        __name(this, "PgArrayBuilder");
      }
      static [entityKind] = "PgArrayBuilder";
      constructor(name, baseBuilder, size) {
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
      }
      /** @internal */
      build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray(
          table,
          this.config,
          baseColumn
        );
      }
    };
    PgArray = class _PgArray extends PgColumn {
      static {
        __name(this, "PgArray");
      }
      constructor(table, config, baseColumn, range) {
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
      }
      size;
      static [entityKind] = "PgArray";
      getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          value = parsePgArray(value);
        }
        return value.map((v) => this.baseColumn.mapFromDriverValue(v));
      }
      mapToDriverValue(value, isNestedArray = false) {
        const a = value.map(
          (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
        );
        if (isNestedArray) return a;
        return makePgArray(a);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/enum.js
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumObjectColumnBuilder, PgEnumObjectColumn, isPgEnumSym, PgEnumColumnBuilder, PgEnumColumn;
var init_enum = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/enum.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_common();
    PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
      static {
        __name(this, "PgEnumObjectColumnBuilder");
      }
      static [entityKind] = "PgEnumObjectColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumObjectColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumObjectColumn(
          table,
          this.config
        );
      }
    };
    PgEnumObjectColumn = class extends PgColumn {
      static {
        __name(this, "PgEnumObjectColumn");
      }
      static [entityKind] = "PgEnumObjectColumn";
      enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
    isPgEnumSym = /* @__PURE__ */ Symbol.for("drizzle:isPgEnum");
    __name(isPgEnum, "isPgEnum");
    PgEnumColumnBuilder = class extends PgColumnBuilder {
      static {
        __name(this, "PgEnumColumnBuilder");
      }
      static [entityKind] = "PgEnumColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumColumn(
          table,
          this.config
        );
      }
    };
    PgEnumColumn = class extends PgColumn {
      static {
        __name(this, "PgEnumColumn");
      }
      static [entityKind] = "PgEnumColumn";
      enum = this.config.enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/subquery.js
var Subquery, WithSubquery;
var init_subquery = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/subquery.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    Subquery = class {
      static {
        __name(this, "Subquery");
      }
      static [entityKind] = "Subquery";
      constructor(sql2, fields, alias, isWith = false, usedTables = []) {
        this._ = {
          brand: "Subquery",
          sql: sql2,
          selectedFields: fields,
          alias,
          isWith,
          usedTables
        };
      }
      // getSQL(): SQL<unknown> {
      // 	return new SQL([this]);
      // }
    };
    WithSubquery = class extends Subquery {
      static {
        __name(this, "WithSubquery");
      }
      static [entityKind] = "WithSubquery";
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/version.js
var version;
var init_version = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/version.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    version = "0.45.2";
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing.js
var otel, rawTracer, tracer;
var init_tracing = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_tracing_utils();
    init_version();
    tracer = {
      startActiveSpan(name, fn) {
        if (!otel) {
          return fn();
        }
        if (!rawTracer) {
          rawTracer = otel.trace.getTracer("drizzle-orm", version);
        }
        return iife(
          (otel2, rawTracer2) => rawTracer2.startActiveSpan(
            name,
            (span) => {
              try {
                return fn(span);
              } catch (e) {
                span.setStatus({
                  code: otel2.SpanStatusCode.ERROR,
                  message: e instanceof Error ? e.message : "Unknown error"
                  // eslint-disable-line no-instanceof/no-instanceof
                });
                throw e;
              } finally {
                span.end();
              }
            }
          ),
          otel,
          rawTracer
        );
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig;
var init_view_common = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/view-common.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    ViewBaseConfig = /* @__PURE__ */ Symbol.for("drizzle:ViewBaseConfig");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values[p.value.name]);
    }
    return p;
  });
}
var FakePrimitiveParam, StringChunk, SQL, Name, noopDecoder, noopEncoder, noopMapper, Param, Placeholder, IsDrizzleView, View;
var init_sql = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/sql.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_enum();
    init_subquery();
    init_tracing();
    init_view_common();
    init_column();
    init_table();
    FakePrimitiveParam = class {
      static {
        __name(this, "FakePrimitiveParam");
      }
      static [entityKind] = "FakePrimitiveParam";
    };
    __name(isSQLWrapper, "isSQLWrapper");
    __name(mergeQueries, "mergeQueries");
    StringChunk = class {
      static {
        __name(this, "StringChunk");
      }
      static [entityKind] = "StringChunk";
      value;
      constructor(value) {
        this.value = Array.isArray(value) ? value : [value];
      }
      getSQL() {
        return new SQL([this]);
      }
    };
    SQL = class _SQL {
      static {
        __name(this, "SQL");
      }
      constructor(queryChunks) {
        this.queryChunks = queryChunks;
        for (const chunk of queryChunks) {
          if (is(chunk, Table)) {
            const schemaName = chunk[Table.Symbol.Schema];
            this.usedTables.push(
              schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
            );
          }
        }
      }
      static [entityKind] = "SQL";
      /** @internal */
      decoder = noopDecoder;
      shouldInlineParams = false;
      /** @internal */
      usedTables = [];
      append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
      }
      toQuery(config) {
        return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
          const query = this.buildQueryFromSourceParams(this.queryChunks, config);
          span?.setAttributes({
            "drizzle.query.text": query.sql,
            "drizzle.query.params": JSON.stringify(query.params)
          });
          return query;
        });
      }
      buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
          inlineParams: _config.inlineParams || this.shouldInlineParams,
          paramStartIndex: _config.paramStartIndex || { value: 0 }
        });
        const {
          casing,
          escapeName,
          escapeParam,
          prepareTyping,
          inlineParams,
          paramStartIndex
        } = config;
        return mergeQueries(chunks.map((chunk) => {
          if (is(chunk, StringChunk)) {
            return { sql: chunk.value.join(""), params: [] };
          }
          if (is(chunk, Name)) {
            return { sql: escapeName(chunk.value), params: [] };
          }
          if (chunk === void 0) {
            return { sql: "", params: [] };
          }
          if (Array.isArray(chunk)) {
            const result = [new StringChunk("(")];
            for (const [i, p] of chunk.entries()) {
              result.push(p);
              if (i < chunk.length - 1) {
                result.push(new StringChunk(", "));
              }
            }
            result.push(new StringChunk(")"));
            return this.buildQueryFromSourceParams(result, config);
          }
          if (is(chunk, _SQL)) {
            return this.buildQueryFromSourceParams(chunk.queryChunks, {
              ...config,
              inlineParams: inlineParams || chunk.shouldInlineParams
            });
          }
          if (is(chunk, Table)) {
            const schemaName = chunk[Table.Symbol.Schema];
            const tableName = chunk[Table.Symbol.Name];
            return {
              sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
              params: []
            };
          }
          if (is(chunk, Column)) {
            const columnName = casing.getColumnCasing(chunk);
            if (_config.invokeSource === "indexes") {
              return { sql: escapeName(columnName), params: [] };
            }
            const schemaName = chunk.table[Table.Symbol.Schema];
            return {
              sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
              params: []
            };
          }
          if (is(chunk, View)) {
            const schemaName = chunk[ViewBaseConfig].schema;
            const viewName = chunk[ViewBaseConfig].name;
            return {
              sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
              params: []
            };
          }
          if (is(chunk, Param)) {
            if (is(chunk.value, Placeholder)) {
              return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
            }
            const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
            if (is(mappedValue, _SQL)) {
              return this.buildQueryFromSourceParams([mappedValue], config);
            }
            if (inlineParams) {
              return { sql: this.mapInlineParam(mappedValue, config), params: [] };
            }
            let typings = ["none"];
            if (prepareTyping) {
              typings = [prepareTyping(chunk.encoder)];
            }
            return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
          }
          if (is(chunk, Placeholder)) {
            return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
          }
          if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
            return { sql: escapeName(chunk.fieldAlias), params: [] };
          }
          if (is(chunk, Subquery)) {
            if (chunk._.isWith) {
              return { sql: escapeName(chunk._.alias), params: [] };
            }
            return this.buildQueryFromSourceParams([
              new StringChunk("("),
              chunk._.sql,
              new StringChunk(") "),
              new Name(chunk._.alias)
            ], config);
          }
          if (isPgEnum(chunk)) {
            if (chunk.schema) {
              return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
            }
            return { sql: escapeName(chunk.enumName), params: [] };
          }
          if (isSQLWrapper(chunk)) {
            if (chunk.shouldOmitSQLParens?.()) {
              return this.buildQueryFromSourceParams([chunk.getSQL()], config);
            }
            return this.buildQueryFromSourceParams([
              new StringChunk("("),
              chunk.getSQL(),
              new StringChunk(")")
            ], config);
          }
          if (inlineParams) {
            return { sql: this.mapInlineParam(chunk, config), params: [] };
          }
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }));
      }
      mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
          return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
          return chunk.toString();
        }
        if (typeof chunk === "string") {
          return escapeString(chunk);
        }
        if (typeof chunk === "object") {
          const mappedValueAsString = chunk.toString();
          if (mappedValueAsString === "[object Object]") {
            return escapeString(JSON.stringify(chunk));
          }
          return escapeString(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
      }
      getSQL() {
        return this;
      }
      as(alias) {
        if (alias === void 0) {
          return this;
        }
        return new _SQL.Aliased(this, alias);
      }
      mapWith(decoder) {
        this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
        return this;
      }
      inlineParams() {
        this.shouldInlineParams = true;
        return this;
      }
      /**
       * This method is used to conditionally include a part of the query.
       *
       * @param condition - Condition to check
       * @returns itself if the condition is `true`, otherwise `undefined`
       */
      if(condition) {
        return condition ? this : void 0;
      }
    };
    Name = class {
      static {
        __name(this, "Name");
      }
      constructor(value) {
        this.value = value;
      }
      static [entityKind] = "Name";
      brand;
      getSQL() {
        return new SQL([this]);
      }
    };
    __name(isDriverValueEncoder, "isDriverValueEncoder");
    noopDecoder = {
      mapFromDriverValue: /* @__PURE__ */ __name((value) => value, "mapFromDriverValue")
    };
    noopEncoder = {
      mapToDriverValue: /* @__PURE__ */ __name((value) => value, "mapToDriverValue")
    };
    noopMapper = {
      ...noopDecoder,
      ...noopEncoder
    };
    Param = class {
      static {
        __name(this, "Param");
      }
      /**
       * @param value - Parameter value
       * @param encoder - Encoder to convert the value to a driver parameter
       */
      constructor(value, encoder = noopEncoder) {
        this.value = value;
        this.encoder = encoder;
      }
      static [entityKind] = "Param";
      brand;
      getSQL() {
        return new SQL([this]);
      }
    };
    __name(sql, "sql");
    ((sql2) => {
      function empty() {
        return new SQL([]);
      }
      __name(empty, "empty");
      sql2.empty = empty;
      function fromList(list) {
        return new SQL(list);
      }
      __name(fromList, "fromList");
      sql2.fromList = fromList;
      function raw2(str) {
        return new SQL([new StringChunk(str)]);
      }
      __name(raw2, "raw");
      sql2.raw = raw2;
      function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()) {
          if (i > 0 && separator !== void 0) {
            result.push(separator);
          }
          result.push(chunk);
        }
        return new SQL(result);
      }
      __name(join, "join");
      sql2.join = join;
      function identifier(value) {
        return new Name(value);
      }
      __name(identifier, "identifier");
      sql2.identifier = identifier;
      function placeholder2(name2) {
        return new Placeholder(name2);
      }
      __name(placeholder2, "placeholder2");
      sql2.placeholder = placeholder2;
      function param2(value, encoder) {
        return new Param(value, encoder);
      }
      __name(param2, "param2");
      sql2.param = param2;
    })(sql || (sql = {}));
    ((SQL2) => {
      class Aliased {
        static {
          __name(this, "Aliased");
        }
        constructor(sql2, fieldAlias) {
          this.sql = sql2;
          this.fieldAlias = fieldAlias;
        }
        static [entityKind] = "SQL.Aliased";
        /** @internal */
        isSelectionField = false;
        getSQL() {
          return this.sql;
        }
        /** @internal */
        clone() {
          return new Aliased(this.sql, this.fieldAlias);
        }
      }
      SQL2.Aliased = Aliased;
    })(SQL || (SQL = {}));
    Placeholder = class {
      static {
        __name(this, "Placeholder");
      }
      constructor(name2) {
        this.name = name2;
      }
      static [entityKind] = "Placeholder";
      getSQL() {
        return new SQL([this]);
      }
    };
    __name(fillPlaceholders, "fillPlaceholders");
    IsDrizzleView = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleView");
    View = class {
      static {
        __name(this, "View");
      }
      static [entityKind] = "View";
      /** @internal */
      [ViewBaseConfig];
      /** @internal */
      [IsDrizzleView] = true;
      constructor({ name: name2, schema, selectedFields, query }) {
        this[ViewBaseConfig] = {
          name: name2,
          originalName: name2,
          schema,
          selectedFields,
          query,
          isExisting: !query,
          isAlias: false
        };
      }
      getSQL() {
        return new SQL([this]);
      }
    };
    Column.prototype.getSQL = function() {
      return new SQL([this]);
    };
    Table.prototype.getSQL = function() {
      return new SQL([this]);
    };
    Subquery.prototype.getSQL = function() {
      return new SQL([this]);
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else if (is(field, Subquery)) {
        decoder = field._.sql.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased) || is(field, Subquery)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index, key] of leftKeys.entries()) {
    if (key !== rightKeys[index]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor") continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
var textDecoder;
var init_utils = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_column();
    init_entity();
    init_sql();
    init_subquery();
    init_table();
    init_view_common();
    __name(mapResultRow, "mapResultRow");
    __name(orderSelectedFields, "orderSelectedFields");
    __name(haveSameKeys, "haveSameKeys");
    __name(mapUpdateSet, "mapUpdateSet");
    __name(applyMixins, "applyMixins");
    __name(getTableColumns, "getTableColumns");
    __name(getTableLikeName, "getTableLikeName");
    __name(getColumnNameAndConfig, "getColumnNameAndConfig");
    textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys, EnableRLS, PgTable;
var init_table2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/table.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table();
    InlineForeignKeys = /* @__PURE__ */ Symbol.for("drizzle:PgInlineForeignKeys");
    EnableRLS = /* @__PURE__ */ Symbol.for("drizzle:EnableRLS");
    PgTable = class extends Table {
      static {
        __name(this, "PgTable");
      }
      static [entityKind] = "PgTable";
      /** @internal */
      static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys,
        EnableRLS
      });
      /**@internal */
      [InlineForeignKeys] = [];
      /** @internal */
      [EnableRLS] = false;
      /** @internal */
      [Table.Symbol.ExtraConfigBuilder] = void 0;
      /** @internal */
      [Table.Symbol.ExtraConfigColumns] = {};
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder, PrimaryKey;
var init_primary_keys = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/primary-keys.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table2();
    PrimaryKeyBuilder = class {
      static {
        __name(this, "PrimaryKeyBuilder");
      }
      static [entityKind] = "PgPrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey(table, this.columns, this.name);
      }
    };
    PrimaryKey = class {
      static {
        __name(this, "PrimaryKey");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [entityKind] = "PgPrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
var eq, ne, gt, gte, lt, lte;
var init_conditions = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/conditions.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_column();
    init_entity();
    init_table();
    init_sql();
    __name(bindIfParam, "bindIfParam");
    eq = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} = ${bindIfParam(right, left)}`;
    }, "eq");
    ne = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} <> ${bindIfParam(right, left)}`;
    }, "ne");
    __name(and, "and");
    __name(or, "or");
    __name(not, "not");
    gt = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} > ${bindIfParam(right, left)}`;
    }, "gt");
    gte = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} >= ${bindIfParam(right, left)}`;
    }, "gte");
    lt = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} < ${bindIfParam(right, left)}`;
    }, "lt");
    lte = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} <= ${bindIfParam(right, left)}`;
    }, "lte");
    __name(inArray, "inArray");
    __name(notInArray, "notInArray");
    __name(isNull, "isNull");
    __name(isNotNull, "isNotNull");
    __name(exists, "exists");
    __name(notExists, "notExists");
    __name(between, "between");
    __name(notBetween, "notBetween");
    __name(like, "like");
    __name(notLike, "notLike");
    __name(ilike, "ilike");
    __name(notIlike, "notIlike");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
var init_select = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/select.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_sql();
    __name(asc, "asc");
    __name(desc, "desc");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/index.js
var init_expressions = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_conditions();
    init_select();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/relations.js
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function createOne(sourceTable) {
  return /* @__PURE__ */ __name(function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  }, "one");
}
function createMany(sourceTable) {
  return /* @__PURE__ */ __name(function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  }, "many");
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
var Relation, Relations, One, Many;
var init_relations = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/relations.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_table();
    init_column();
    init_entity();
    init_primary_keys();
    init_expressions();
    init_sql();
    Relation = class {
      static {
        __name(this, "Relation");
      }
      constructor(sourceTable, referencedTable, relationName) {
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[Table.Symbol.Name];
      }
      static [entityKind] = "Relation";
      referencedTableName;
      fieldName;
    };
    Relations = class {
      static {
        __name(this, "Relations");
      }
      constructor(table, config) {
        this.table = table;
        this.config = config;
      }
      static [entityKind] = "Relations";
    };
    One = class _One extends Relation {
      static {
        __name(this, "One");
      }
      constructor(sourceTable, referencedTable, config, isNullable) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
      }
      static [entityKind] = "One";
      withFieldName(fieldName) {
        const relation = new _One(
          this.sourceTable,
          this.referencedTable,
          this.config,
          this.isNullable
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    Many = class _Many extends Relation {
      static {
        __name(this, "Many");
      }
      constructor(sourceTable, referencedTable, config) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
      }
      static [entityKind] = "Many";
      withFieldName(fieldName) {
        const relation = new _Many(
          this.sourceTable,
          this.referencedTable,
          this.config
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    __name(getOperators, "getOperators");
    __name(getOrderByOperators, "getOrderByOperators");
    __name(extractTablesRelationalConfig, "extractTablesRelationalConfig");
    __name(createOne, "createOne");
    __name(createMany, "createMany");
    __name(normalizeRelation, "normalizeRelation");
    __name(createTableRelationsHelpers, "createTableRelationsHelpers");
    __name(mapRelationalRow, "mapRelationalRow");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/alias.js
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
var ColumnAliasProxyHandler, TableAliasProxyHandler, RelationTableAliasProxyHandler;
var init_alias = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/alias.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_column();
    init_entity();
    init_sql();
    init_table();
    init_view_common();
    ColumnAliasProxyHandler = class {
      static {
        __name(this, "ColumnAliasProxyHandler");
      }
      constructor(table) {
        this.table = table;
      }
      static [entityKind] = "ColumnAliasProxyHandler";
      get(columnObj, prop) {
        if (prop === "table") {
          return this.table;
        }
        return columnObj[prop];
      }
    };
    TableAliasProxyHandler = class {
      static {
        __name(this, "TableAliasProxyHandler");
      }
      constructor(alias, replaceOriginalName) {
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
      }
      static [entityKind] = "TableAliasProxyHandler";
      get(target, prop) {
        if (prop === Table.Symbol.IsAlias) {
          return true;
        }
        if (prop === Table.Symbol.Name) {
          return this.alias;
        }
        if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
          return this.alias;
        }
        if (prop === ViewBaseConfig) {
          return {
            ...target[ViewBaseConfig],
            name: this.alias,
            isAlias: true
          };
        }
        if (prop === Table.Symbol.Columns) {
          const columns = target[Table.Symbol.Columns];
          if (!columns) {
            return columns;
          }
          const proxiedColumns = {};
          Object.keys(columns).map((key) => {
            proxiedColumns[key] = new Proxy(
              columns[key],
              new ColumnAliasProxyHandler(new Proxy(target, this))
            );
          });
          return proxiedColumns;
        }
        const value = target[prop];
        if (is(value, Column)) {
          return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
        }
        return value;
      }
    };
    RelationTableAliasProxyHandler = class {
      static {
        __name(this, "RelationTableAliasProxyHandler");
      }
      constructor(alias) {
        this.alias = alias;
      }
      static [entityKind] = "RelationTableAliasProxyHandler";
      get(target, prop) {
        if (prop === "sourceTable") {
          return aliasedTable(target.sourceTable, this.alias);
        }
        return target[prop];
      }
    };
    __name(aliasedTable, "aliasedTable");
    __name(aliasedTableColumn, "aliasedTableColumn");
    __name(mapColumnsInAliasedSQLToAlias, "mapColumnsInAliasedSQLToAlias");
    __name(mapColumnsInSQLToAlias, "mapColumnsInSQLToAlias");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler;
var init_selection_proxy = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/selection-proxy.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_alias();
    init_column();
    init_entity();
    init_sql();
    init_subquery();
    init_view_common();
    SelectionProxyHandler = class _SelectionProxyHandler {
      static {
        __name(this, "SelectionProxyHandler");
      }
      static [entityKind] = "SelectionProxyHandler";
      config;
      constructor(config) {
        this.config = { ...config };
      }
      get(subquery, prop) {
        if (prop === "_") {
          return {
            ...subquery["_"],
            selectedFields: new Proxy(
              subquery._.selectedFields,
              this
            )
          };
        }
        if (prop === ViewBaseConfig) {
          return {
            ...subquery[ViewBaseConfig],
            selectedFields: new Proxy(
              subquery[ViewBaseConfig].selectedFields,
              this
            )
          };
        }
        if (typeof prop === "symbol") {
          return subquery[prop];
        }
        const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
        const value = columns[prop];
        if (is(value, SQL.Aliased)) {
          if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
            return value.sql;
          }
          const newValue = value.clone();
          newValue.isSelectionField = true;
          return newValue;
        }
        if (is(value, SQL)) {
          if (this.config.sqlBehavior === "sql") {
            return value;
          }
          throw new Error(
            `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
          );
        }
        if (is(value, Column)) {
          if (this.config.alias) {
            return new Proxy(
              value,
              new ColumnAliasProxyHandler(
                new Proxy(
                  value.table,
                  new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
                )
              )
            );
          }
          return value;
        }
        if (typeof value !== "object" || value === null) {
          return value;
        }
        return new Proxy(value, new _SelectionProxyHandler(this.config));
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/query-promise.js
var QueryPromise;
var init_query_promise = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/query-promise.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    QueryPromise = class {
      static {
        __name(this, "QueryPromise");
      }
      static [entityKind] = "QueryPromise";
      [Symbol.toStringTag] = "QueryPromise";
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
      then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder2, ForeignKey2;
var init_foreign_keys2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/foreign-keys.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table_utils();
    ForeignKeyBuilder2 = class {
      static {
        __name(this, "ForeignKeyBuilder");
      }
      static [entityKind] = "SQLiteForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate;
      /** @internal */
      _onDelete;
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey2(table, this);
      }
    };
    ForeignKey2 = class {
      static {
        __name(this, "ForeignKey");
      }
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [entityKind] = "SQLiteForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[TableName],
          ...columnNames,
          foreignColumns[0].table[TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName2(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder2, UniqueOnConstraintBuilder2, UniqueConstraint2;
var init_unique_constraint2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/unique-constraint.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table_utils();
    __name(uniqueKeyName2, "uniqueKeyName");
    UniqueConstraintBuilder2 = class {
      static {
        __name(this, "UniqueConstraintBuilder");
      }
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [entityKind] = "SQLiteUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      build(table) {
        return new UniqueConstraint2(table, this.columns, this.name);
      }
    };
    UniqueOnConstraintBuilder2 = class {
      static {
        __name(this, "UniqueOnConstraintBuilder");
      }
      static [entityKind] = "SQLiteUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder2(columns, this.name);
      }
    };
    UniqueConstraint2 = class {
      static {
        __name(this, "UniqueConstraint");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
      }
      static [entityKind] = "SQLiteUniqueConstraint";
      columns;
      name;
      getName() {
        return this.name;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder, SQLiteColumn;
var init_common2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/common.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_column_builder();
    init_column();
    init_entity();
    init_foreign_keys2();
    init_unique_constraint2();
    SQLiteColumnBuilder = class extends ColumnBuilder {
      static {
        __name(this, "SQLiteColumnBuilder");
      }
      static [entityKind] = "SQLiteColumnBuilder";
      foreignKeyConfigs = [];
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
      }
      generatedAlwaysAs(as, config) {
        this.config.generated = {
          as,
          type: "always",
          mode: config?.mode ?? "virtual"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return ((ref2, actions2) => {
            const builder = new ForeignKeyBuilder2(() => {
              const foreignColumn = ref2();
              return { columns: [column], foreignColumns: [foreignColumn] };
            });
            if (actions2.onUpdate) {
              builder.onUpdate(actions2.onUpdate);
            }
            if (actions2.onDelete) {
              builder.onDelete(actions2.onDelete);
            }
            return builder.build(table);
          })(ref, actions);
        });
      }
    };
    SQLiteColumn = class extends Column {
      static {
        __name(this, "SQLiteColumn");
      }
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = uniqueKeyName2(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [entityKind] = "SQLiteColumn";
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/blob.js
function blob(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}
var SQLiteBigIntBuilder, SQLiteBigInt, SQLiteBlobJsonBuilder, SQLiteBlobJson, SQLiteBlobBufferBuilder, SQLiteBlobBuffer;
var init_blob = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/blob.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_utils();
    init_common2();
    SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBigIntBuilder");
      }
      static [entityKind] = "SQLiteBigIntBuilder";
      constructor(name) {
        super(name, "bigint", "SQLiteBigInt");
      }
      /** @internal */
      build(table) {
        return new SQLiteBigInt(table, this.config);
      }
    };
    SQLiteBigInt = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBigInt");
      }
      static [entityKind] = "SQLiteBigInt";
      getSQLType() {
        return "blob";
      }
      mapFromDriverValue(value) {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
          return BigInt(buf.toString("utf8"));
        }
        return BigInt(textDecoder.decode(value));
      }
      mapToDriverValue(value) {
        return Buffer.from(value.toString());
      }
    };
    SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBlobJsonBuilder");
      }
      static [entityKind] = "SQLiteBlobJsonBuilder";
      constructor(name) {
        super(name, "json", "SQLiteBlobJson");
      }
      /** @internal */
      build(table) {
        return new SQLiteBlobJson(
          table,
          this.config
        );
      }
    };
    SQLiteBlobJson = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBlobJson");
      }
      static [entityKind] = "SQLiteBlobJson";
      getSQLType() {
        return "blob";
      }
      mapFromDriverValue(value) {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
          return JSON.parse(buf.toString("utf8"));
        }
        return JSON.parse(textDecoder.decode(value));
      }
      mapToDriverValue(value) {
        return Buffer.from(JSON.stringify(value));
      }
    };
    SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBlobBufferBuilder");
      }
      static [entityKind] = "SQLiteBlobBufferBuilder";
      constructor(name) {
        super(name, "buffer", "SQLiteBlobBuffer");
      }
      /** @internal */
      build(table) {
        return new SQLiteBlobBuffer(table, this.config);
      }
    };
    SQLiteBlobBuffer = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBlobBuffer");
      }
      static [entityKind] = "SQLiteBlobBuffer";
      mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
          return value;
        }
        return Buffer.from(value);
      }
      getSQLType() {
        return "blob";
      }
    };
    __name(blob, "blob");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/custom.js
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(
      name,
      config,
      customTypeParams
    );
  };
}
var SQLiteCustomColumnBuilder, SQLiteCustomColumn;
var init_custom = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/custom.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_utils();
    init_common2();
    SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteCustomColumnBuilder");
      }
      static [entityKind] = "SQLiteCustomColumnBuilder";
      constructor(name, fieldConfig, customTypeParams) {
        super(name, "custom", "SQLiteCustomColumn");
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
      }
      /** @internal */
      build(table) {
        return new SQLiteCustomColumn(
          table,
          this.config
        );
      }
    };
    SQLiteCustomColumn = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteCustomColumn");
      }
      static [entityKind] = "SQLiteCustomColumn";
      sqlName;
      mapTo;
      mapFrom;
      constructor(table, config) {
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
      }
      getSQLType() {
        return this.sqlName;
      }
      mapFromDriverValue(value) {
        return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
      }
      mapToDriverValue(value) {
        return typeof this.mapTo === "function" ? this.mapTo(value) : value;
      }
    };
    __name(customType, "customType");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/integer.js
function integer(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if (config?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
var SQLiteBaseIntegerBuilder, SQLiteBaseInteger, SQLiteIntegerBuilder, SQLiteInteger, SQLiteTimestampBuilder, SQLiteTimestamp, SQLiteBooleanBuilder, SQLiteBoolean;
var init_integer = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/integer.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_sql();
    init_utils();
    init_common2();
    SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBaseIntegerBuilder");
      }
      static [entityKind] = "SQLiteBaseIntegerBuilder";
      constructor(name, dataType, columnType) {
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
      }
      primaryKey(config) {
        if (config?.autoIncrement) {
          this.config.autoIncrement = true;
        }
        this.config.hasDefault = true;
        return super.primaryKey();
      }
    };
    SQLiteBaseInteger = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBaseInteger");
      }
      static [entityKind] = "SQLiteBaseInteger";
      autoIncrement = this.config.autoIncrement;
      getSQLType() {
        return "integer";
      }
    };
    SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
      static {
        __name(this, "SQLiteIntegerBuilder");
      }
      static [entityKind] = "SQLiteIntegerBuilder";
      constructor(name) {
        super(name, "number", "SQLiteInteger");
      }
      build(table) {
        return new SQLiteInteger(
          table,
          this.config
        );
      }
    };
    SQLiteInteger = class extends SQLiteBaseInteger {
      static {
        __name(this, "SQLiteInteger");
      }
      static [entityKind] = "SQLiteInteger";
    };
    SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
      static {
        __name(this, "SQLiteTimestampBuilder");
      }
      static [entityKind] = "SQLiteTimestampBuilder";
      constructor(name, mode) {
        super(name, "date", "SQLiteTimestamp");
        this.config.mode = mode;
      }
      /**
       * @deprecated Use `default()` with your own expression instead.
       *
       * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
       */
      defaultNow() {
        return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
      }
      build(table) {
        return new SQLiteTimestamp(
          table,
          this.config
        );
      }
    };
    SQLiteTimestamp = class extends SQLiteBaseInteger {
      static {
        __name(this, "SQLiteTimestamp");
      }
      static [entityKind] = "SQLiteTimestamp";
      mode = this.config.mode;
      mapFromDriverValue(value) {
        if (this.config.mode === "timestamp") {
          return new Date(value * 1e3);
        }
        return new Date(value);
      }
      mapToDriverValue(value) {
        const unix = value.getTime();
        if (this.config.mode === "timestamp") {
          return Math.floor(unix / 1e3);
        }
        return unix;
      }
    };
    SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
      static {
        __name(this, "SQLiteBooleanBuilder");
      }
      static [entityKind] = "SQLiteBooleanBuilder";
      constructor(name, mode) {
        super(name, "boolean", "SQLiteBoolean");
        this.config.mode = mode;
      }
      build(table) {
        return new SQLiteBoolean(
          table,
          this.config
        );
      }
    };
    SQLiteBoolean = class extends SQLiteBaseInteger {
      static {
        __name(this, "SQLiteBoolean");
      }
      static [entityKind] = "SQLiteBoolean";
      mode = this.config.mode;
      mapFromDriverValue(value) {
        return Number(value) === 1;
      }
      mapToDriverValue(value) {
        return value ? 1 : 0;
      }
    };
    __name(integer, "integer");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/numeric.js
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
var SQLiteNumericBuilder, SQLiteNumeric, SQLiteNumericNumberBuilder, SQLiteNumericNumber, SQLiteNumericBigIntBuilder, SQLiteNumericBigInt;
var init_numeric = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/numeric.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_utils();
    init_common2();
    SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteNumericBuilder");
      }
      static [entityKind] = "SQLiteNumericBuilder";
      constructor(name) {
        super(name, "string", "SQLiteNumeric");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumeric(
          table,
          this.config
        );
      }
    };
    SQLiteNumeric = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteNumeric");
      }
      static [entityKind] = "SQLiteNumeric";
      mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        return String(value);
      }
      getSQLType() {
        return "numeric";
      }
    };
    SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteNumericNumberBuilder");
      }
      static [entityKind] = "SQLiteNumericNumberBuilder";
      constructor(name) {
        super(name, "number", "SQLiteNumericNumber");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumericNumber(
          table,
          this.config
        );
      }
    };
    SQLiteNumericNumber = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteNumericNumber");
      }
      static [entityKind] = "SQLiteNumericNumber";
      mapFromDriverValue(value) {
        if (typeof value === "number") return value;
        return Number(value);
      }
      mapToDriverValue = String;
      getSQLType() {
        return "numeric";
      }
    };
    SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteNumericBigIntBuilder");
      }
      static [entityKind] = "SQLiteNumericBigIntBuilder";
      constructor(name) {
        super(name, "bigint", "SQLiteNumericBigInt");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumericBigInt(
          table,
          this.config
        );
      }
    };
    SQLiteNumericBigInt = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteNumericBigInt");
      }
      static [entityKind] = "SQLiteNumericBigInt";
      mapFromDriverValue = BigInt;
      mapToDriverValue = String;
      getSQLType() {
        return "numeric";
      }
    };
    __name(numeric, "numeric");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/real.js
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
var SQLiteRealBuilder, SQLiteReal;
var init_real = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/real.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_common2();
    SQLiteRealBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteRealBuilder");
      }
      static [entityKind] = "SQLiteRealBuilder";
      constructor(name) {
        super(name, "number", "SQLiteReal");
      }
      /** @internal */
      build(table) {
        return new SQLiteReal(table, this.config);
      }
    };
    SQLiteReal = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteReal");
      }
      static [entityKind] = "SQLiteReal";
      getSQLType() {
        return "real";
      }
    };
    __name(real, "real");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/text.js
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config);
}
var SQLiteTextBuilder, SQLiteText, SQLiteTextJsonBuilder, SQLiteTextJson;
var init_text = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/text.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_utils();
    init_common2();
    SQLiteTextBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteTextBuilder");
      }
      static [entityKind] = "SQLiteTextBuilder";
      constructor(name, config) {
        super(name, "string", "SQLiteText");
        this.config.enumValues = config.enum;
        this.config.length = config.length;
      }
      /** @internal */
      build(table) {
        return new SQLiteText(
          table,
          this.config
        );
      }
    };
    SQLiteText = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteText");
      }
      static [entityKind] = "SQLiteText";
      enumValues = this.config.enumValues;
      length = this.config.length;
      constructor(table, config) {
        super(table, config);
      }
      getSQLType() {
        return `text${this.config.length ? `(${this.config.length})` : ""}`;
      }
    };
    SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteTextJsonBuilder");
      }
      static [entityKind] = "SQLiteTextJsonBuilder";
      constructor(name) {
        super(name, "json", "SQLiteTextJson");
      }
      /** @internal */
      build(table) {
        return new SQLiteTextJson(
          table,
          this.config
        );
      }
    };
    SQLiteTextJson = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteTextJson");
      }
      static [entityKind] = "SQLiteTextJson";
      getSQLType() {
        return "text";
      }
      mapFromDriverValue(value) {
        return JSON.parse(value);
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
    };
    __name(text, "text");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}
var init_all = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/all.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_blob();
    init_custom();
    init_integer();
    init_numeric();
    init_real();
    init_text();
    __name(getSQLiteColumnBuilders, "getSQLiteColumnBuilders");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/table.js
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
var InlineForeignKeys2, SQLiteTable, sqliteTable;
var init_table3 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/table.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table();
    init_all();
    InlineForeignKeys2 = /* @__PURE__ */ Symbol.for("drizzle:SQLiteInlineForeignKeys");
    SQLiteTable = class extends Table {
      static {
        __name(this, "SQLiteTable");
      }
      static [entityKind] = "SQLiteTable";
      /** @internal */
      static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys: InlineForeignKeys2
      });
      /** @internal */
      [Table.Symbol.Columns];
      /** @internal */
      [InlineForeignKeys2] = [];
      /** @internal */
      [Table.Symbol.ExtraConfigBuilder] = void 0;
    };
    __name(sqliteTableBase, "sqliteTableBase");
    sqliteTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
      return sqliteTableBase(name, columns, extraConfig);
    }, "sqliteTable");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/checks.js
var CheckBuilder, Check;
var init_checks = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/checks.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    CheckBuilder = class {
      static {
        __name(this, "CheckBuilder");
      }
      constructor(name, value) {
        this.name = name;
        this.value = value;
      }
      static [entityKind] = "SQLiteCheckBuilder";
      brand;
      build(table) {
        return new Check(table, this);
      }
    };
    Check = class {
      static {
        __name(this, "Check");
      }
      constructor(table, builder) {
        this.table = table;
        this.name = builder.name;
        this.value = builder.value;
      }
      static [entityKind] = "SQLiteCheck";
      name;
      value;
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/indexes.js
var IndexBuilderOn, IndexBuilder, Index;
var init_indexes = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/indexes.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    IndexBuilderOn = class {
      static {
        __name(this, "IndexBuilderOn");
      }
      constructor(name, unique) {
        this.name = name;
        this.unique = unique;
      }
      static [entityKind] = "SQLiteIndexBuilderOn";
      on(...columns) {
        return new IndexBuilder(this.name, columns, this.unique);
      }
    };
    IndexBuilder = class {
      static {
        __name(this, "IndexBuilder");
      }
      static [entityKind] = "SQLiteIndexBuilder";
      /** @internal */
      config;
      constructor(name, columns, unique) {
        this.config = {
          name,
          columns,
          unique,
          where: void 0
        };
      }
      /**
       * Condition for partial index.
       */
      where(condition) {
        this.config.where = condition;
        return this;
      }
      /** @internal */
      build(table) {
        return new Index(this.config, table);
      }
    };
    Index = class {
      static {
        __name(this, "Index");
      }
      static [entityKind] = "SQLiteIndex";
      config;
      constructor(config, table) {
        this.config = { ...config, table };
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/primary-keys.js
var PrimaryKeyBuilder2, PrimaryKey2;
var init_primary_keys2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/primary-keys.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table3();
    PrimaryKeyBuilder2 = class {
      static {
        __name(this, "PrimaryKeyBuilder");
      }
      static [entityKind] = "SQLitePrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey2(table, this.columns, this.name);
      }
    };
    PrimaryKey2 = class {
      static {
        __name(this, "PrimaryKey");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [entityKind] = "SQLitePrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[SQLiteTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/utils.js
function extractUsedTable(table) {
  if (is(table, SQLiteTable)) {
    return [`${table[Table.Symbol.BaseName]}`];
  }
  if (is(table, Subquery)) {
    return table._.usedTables ?? [];
  }
  if (is(table, SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}
var init_utils2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/utils.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_sql();
    init_subquery();
    init_table();
    init_table3();
    __name(extractUsedTable, "extractUsedTable");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase;
var init_delete = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/delete.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_query_promise();
    init_selection_proxy();
    init_table3();
    init_table();
    init_utils();
    init_utils2();
    SQLiteDeleteBase = class extends QueryPromise {
      static {
        __name(this, "SQLiteDeleteBase");
      }
      constructor(table, session, dialect, withList) {
        super();
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.config = { table, withList };
      }
      static [entityKind] = "SQLiteDelete";
      /** @internal */
      config;
      /**
       * Adds a `where` clause to the query.
       *
       * Calling this method will delete only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/delete}
       *
       * @param where the `where` clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be deleted.
       *
       * ```ts
       * // Delete all cars with green color
       * db.delete(cars).where(eq(cars.color, 'green'));
       * // or
       * db.delete(cars).where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Delete all BMW cars with a green color
       * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Delete all cars with the green or blue color
       * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        this.config.where = where;
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.table[Table.Symbol.Columns],
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          this.config.orderBy = orderByArray;
        } else {
          const orderByArray = columns;
          this.config.orderBy = orderByArray;
        }
        return this;
      }
      limit(limit) {
        this.config.limit = limit;
        return this;
      }
      returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildDeleteQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "delete",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute(placeholderValues) {
        return this._prepare().execute(placeholderValues);
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache;
var init_casing = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/casing.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_table();
    __name(toSnakeCase, "toSnakeCase");
    __name(toCamelCase, "toCamelCase");
    __name(noopCase, "noopCase");
    CasingCache = class {
      static {
        __name(this, "CasingCache");
      }
      static [entityKind] = "CasingCache";
      /** @internal */
      cache = {};
      cachedTables = {};
      convert;
      constructor(casing) {
        this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
      }
      getColumnCasing(column) {
        if (!column.keyAsName) return column.name;
        const schema = column.table[Table.Symbol.Schema] ?? "public";
        const tableName = column.table[Table.Symbol.OriginalName];
        const key = `${schema}.${tableName}.${column.name}`;
        if (!this.cache[key]) {
          this.cacheTable(column.table);
        }
        return this.cache[key];
      }
      cacheTable(table) {
        const schema = table[Table.Symbol.Schema] ?? "public";
        const tableName = table[Table.Symbol.OriginalName];
        const tableKey = `${schema}.${tableName}`;
        if (!this.cachedTables[tableKey]) {
          for (const column of Object.values(table[Table.Symbol.Columns])) {
            const columnKey = `${tableKey}.${column.name}`;
            this.cache[columnKey] = this.convert(column.name);
          }
          this.cachedTables[tableKey] = true;
        }
      }
      clearCache() {
        this.cache = {};
        this.cachedTables = {};
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/errors.js
var DrizzleError, DrizzleQueryError, TransactionRollbackError;
var init_errors = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/errors.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    DrizzleError = class extends Error {
      static {
        __name(this, "DrizzleError");
      }
      static [entityKind] = "DrizzleError";
      constructor({ message, cause }) {
        super(message);
        this.name = "DrizzleError";
        this.cause = cause;
      }
    };
    DrizzleQueryError = class _DrizzleQueryError extends Error {
      static {
        __name(this, "DrizzleQueryError");
      }
      constructor(query, params, cause) {
        super(`Failed query: ${query}
params: ${params}`);
        this.query = query;
        this.params = params;
        this.cause = cause;
        Error.captureStackTrace(this, _DrizzleQueryError);
        if (cause) this.cause = cause;
      }
    };
    TransactionRollbackError = class extends DrizzleError {
      static {
        __name(this, "TransactionRollbackError");
      }
      static [entityKind] = "TransactionRollbackError";
      constructor() {
        super({ message: "Rollback" });
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/aggregate.js
var init_aggregate = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/aggregate.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/vector.js
var init_vector = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/vector.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/index.js
var init_functions = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_aggregate();
    init_vector();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/index.js
var init_sql2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_expressions();
    init_functions();
    init_sql();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/index.js
var init_columns = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/columns/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_blob();
    init_common2();
    init_custom();
    init_integer();
    init_numeric();
    init_real();
    init_text();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/view-base.js
var SQLiteViewBase;
var init_view_base = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/view-base.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_sql();
    SQLiteViewBase = class extends View {
      static {
        __name(this, "SQLiteViewBase");
      }
      static [entityKind] = "SQLiteViewBase";
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect, SQLiteSyncDialect, SQLiteAsyncDialect;
var init_dialect = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/dialect.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_alias();
    init_casing();
    init_column();
    init_entity();
    init_errors();
    init_relations();
    init_sql2();
    init_sql();
    init_columns();
    init_table3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_view_base();
    SQLiteDialect = class {
      static {
        __name(this, "SQLiteDialect");
      }
      static [entityKind] = "SQLiteDialect";
      /** @internal */
      casing;
      constructor(config) {
        this.casing = new CasingCache(config?.casing);
      }
      escapeName(name) {
        return `"${name.replace(/"/g, '""')}"`;
      }
      escapeParam(_num) {
        return "?";
      }
      escapeString(str) {
        return `'${str.replace(/'/g, "''")}'`;
      }
      buildWithCTE(queries) {
        if (!queries?.length) return void 0;
        const withSqlChunks = [sql`with `];
        for (const [i, w] of queries.entries()) {
          withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
          if (i < queries.length - 1) {
            withSqlChunks.push(sql`, `);
          }
        }
        withSqlChunks.push(sql` `);
        return sql.join(withSqlChunks);
      }
      buildDeleteQuery({
        table,
        where,
        returning,
        withList,
        limit,
        orderBy
      }) {
        const withSql = this.buildWithCTE(withList);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const whereSql = where ? sql` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
      }
      buildUpdateSet(table, set) {
        const tableColumns = table[Table.Symbol.Columns];
        const columnNames = Object.keys(tableColumns).filter(
          (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
        );
        const setSize = columnNames.length;
        return sql.join(
          columnNames.flatMap((colName, i) => {
            const col = tableColumns[colName];
            const onUpdateFnResult = col.onUpdateFn?.();
            const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
            const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
            if (i < setSize - 1) {
              return [res, sql.raw(", ")];
            }
            return [res];
          })
        );
      }
      buildUpdateQuery({
        table,
        set,
        where,
        returning,
        withList,
        joins,
        from,
        limit,
        orderBy
      }) {
        const withSql = this.buildWithCTE(withList);
        const setSql = this.buildUpdateSet(table, set);
        const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
        const joinsSql = this.buildJoins(joins);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const whereSql = where ? sql` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
      }
      /**
       * Builds selection SQL with provided fields/expressions
       *
       * Examples:
       *
       * `select <selection> from`
       *
       * `insert ... returning <selection>`
       *
       * If `isSingleTable` is true, then columns won't be prefixed with table name
       */
      buildSelection(fields, { isSingleTable = false } = {}) {
        const columnsLen = fields.length;
        const chunks = fields.flatMap(({ field }, i) => {
          const chunk = [];
          if (is(field, SQL.Aliased) && field.isSelectionField) {
            chunk.push(sql.identifier(field.fieldAlias));
          } else if (is(field, SQL.Aliased) || is(field, SQL)) {
            const query = is(field, SQL.Aliased) ? field.sql : field;
            if (isSingleTable) {
              chunk.push(
                new SQL(
                  query.queryChunks.map((c) => {
                    if (is(c, Column)) {
                      return sql.identifier(this.casing.getColumnCasing(c));
                    }
                    return c;
                  })
                )
              );
            } else {
              chunk.push(query);
            }
            if (is(field, SQL.Aliased)) {
              chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
            }
          } else if (is(field, Column)) {
            const tableName = field.table[Table.Symbol.Name];
            if (field.columnType === "SQLiteNumericBigInt") {
              if (isSingleTable) {
                chunk.push(
                  sql`cast(${sql.identifier(this.casing.getColumnCasing(field))} as text)`
                );
              } else {
                chunk.push(
                  sql`cast(${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))} as text)`
                );
              }
            } else {
              if (isSingleTable) {
                chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
              } else {
                chunk.push(
                  sql`${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))}`
                );
              }
            }
          } else if (is(field, Subquery)) {
            const entries = Object.entries(field._.selectedFields);
            if (entries.length === 1) {
              const entry = entries[0][1];
              const fieldDecoder = is(entry, SQL) ? entry.decoder : is(entry, Column) ? { mapFromDriverValue: /* @__PURE__ */ __name((v) => entry.mapFromDriverValue(v), "mapFromDriverValue") } : entry.sql.decoder;
              if (fieldDecoder) field._.sql.decoder = fieldDecoder;
            }
            chunk.push(field);
          }
          if (i < columnsLen - 1) {
            chunk.push(sql`, `);
          }
          return chunk;
        });
        return sql.join(chunks);
      }
      buildJoins(joins) {
        if (!joins || joins.length === 0) {
          return void 0;
        }
        const joinsArray = [];
        if (joins) {
          for (const [index, joinMeta] of joins.entries()) {
            if (index === 0) {
              joinsArray.push(sql` `);
            }
            const table = joinMeta.table;
            const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
            if (is(table, SQLiteTable)) {
              const tableName = table[SQLiteTable.Symbol.Name];
              const tableSchema = table[SQLiteTable.Symbol.Schema];
              const origTableName = table[SQLiteTable.Symbol.OriginalName];
              const alias = tableName === origTableName ? void 0 : joinMeta.alias;
              joinsArray.push(
                sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(
                  origTableName
                )}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
              );
            } else {
              joinsArray.push(
                sql`${sql.raw(joinMeta.joinType)} join ${table}${onSql}`
              );
            }
            if (index < joins.length - 1) {
              joinsArray.push(sql` `);
            }
          }
        }
        return sql.join(joinsArray);
      }
      buildLimit(limit) {
        return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
      }
      buildOrderBy(orderBy) {
        const orderByList = [];
        if (orderBy) {
          for (const [index, orderByValue] of orderBy.entries()) {
            orderByList.push(orderByValue);
            if (index < orderBy.length - 1) {
              orderByList.push(sql`, `);
            }
          }
        }
        return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
      }
      buildFromTable(table) {
        if (is(table, Table) && table[Table.Symbol.IsAlias]) {
          return sql`${sql`${sql.identifier(table[Table.Symbol.Schema] ?? "")}.`.if(table[Table.Symbol.Schema])}${sql.identifier(
            table[Table.Symbol.OriginalName]
          )} ${sql.identifier(table[Table.Symbol.Name])}`;
        }
        return table;
      }
      buildSelectQuery({
        withList,
        fields,
        fieldsFlat,
        where,
        having,
        table,
        joins,
        orderBy,
        groupBy,
        limit,
        offset,
        distinct,
        setOperators
      }) {
        const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
        for (const f of fieldsList) {
          if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
            ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
          ))(f.field.table)) {
            const tableName = getTableName(f.field.table);
            throw new Error(
              `Your "${f.path.join(
                "->"
              )}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
            );
          }
        }
        const isSingleTable = !joins || joins.length === 0;
        const withSql = this.buildWithCTE(withList);
        const distinctSql = distinct ? sql` distinct` : void 0;
        const selection = this.buildSelection(fieldsList, { isSingleTable });
        const tableSql = this.buildFromTable(table);
        const joinsSql = this.buildJoins(joins);
        const whereSql = where ? sql` where ${where}` : void 0;
        const havingSql = having ? sql` having ${having}` : void 0;
        const groupByList = [];
        if (groupBy) {
          for (const [index, groupByValue] of groupBy.entries()) {
            groupByList.push(groupByValue);
            if (index < groupBy.length - 1) {
              groupByList.push(sql`, `);
            }
          }
        }
        const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        const offsetSql = offset ? sql` offset ${offset}` : void 0;
        const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
        if (setOperators.length > 0) {
          return this.buildSetOperations(finalQuery, setOperators);
        }
        return finalQuery;
      }
      buildSetOperations(leftSelect, setOperators) {
        const [setOperator, ...rest] = setOperators;
        if (!setOperator) {
          throw new Error("Cannot pass undefined values to any set operator");
        }
        if (rest.length === 0) {
          return this.buildSetOperationQuery({ leftSelect, setOperator });
        }
        return this.buildSetOperations(
          this.buildSetOperationQuery({ leftSelect, setOperator }),
          rest
        );
      }
      buildSetOperationQuery({
        leftSelect,
        setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
      }) {
        const leftChunk = sql`${leftSelect.getSQL()} `;
        const rightChunk = sql`${rightSelect.getSQL()}`;
        let orderBySql;
        if (orderBy && orderBy.length > 0) {
          const orderByValues = [];
          for (const singleOrderBy of orderBy) {
            if (is(singleOrderBy, SQLiteColumn)) {
              orderByValues.push(sql.identifier(singleOrderBy.name));
            } else if (is(singleOrderBy, SQL)) {
              for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
                const chunk = singleOrderBy.queryChunks[i];
                if (is(chunk, SQLiteColumn)) {
                  singleOrderBy.queryChunks[i] = sql.identifier(
                    this.casing.getColumnCasing(chunk)
                  );
                }
              }
              orderByValues.push(sql`${singleOrderBy}`);
            } else {
              orderByValues.push(sql`${singleOrderBy}`);
            }
          }
          orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
        }
        const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
        const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
        const offsetSql = offset ? sql` offset ${offset}` : void 0;
        return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
      }
      buildInsertQuery({
        table,
        values: valuesOrSelect,
        onConflict,
        returning,
        withList,
        select
      }) {
        const valuesSqlList = [];
        const columns = table[Table.Symbol.Columns];
        const colEntries = Object.entries(columns).filter(
          ([_, col]) => !col.shouldDisableInsert()
        );
        const insertOrder = colEntries.map(([, column]) => sql.identifier(this.casing.getColumnCasing(column)));
        if (select) {
          const select2 = valuesOrSelect;
          if (is(select2, SQL)) {
            valuesSqlList.push(select2);
          } else {
            valuesSqlList.push(select2.getSQL());
          }
        } else {
          const values = valuesOrSelect;
          valuesSqlList.push(sql.raw("values "));
          for (const [valueIndex, value] of values.entries()) {
            const valueList = [];
            for (const [fieldName, col] of colEntries) {
              const colValue = value[fieldName];
              if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
                let defaultValue;
                if (col.default !== null && col.default !== void 0) {
                  defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
                } else if (col.defaultFn !== void 0) {
                  const defaultFnResult = col.defaultFn();
                  defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
                } else if (!col.default && col.onUpdateFn !== void 0) {
                  const onUpdateFnResult = col.onUpdateFn();
                  defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
                } else {
                  defaultValue = sql`null`;
                }
                valueList.push(defaultValue);
              } else {
                valueList.push(colValue);
              }
            }
            valuesSqlList.push(valueList);
            if (valueIndex < values.length - 1) {
              valuesSqlList.push(sql`, `);
            }
          }
        }
        const withSql = this.buildWithCTE(withList);
        const valuesSql = sql.join(valuesSqlList);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const onConflictSql = onConflict?.length ? sql.join(onConflict) : void 0;
        return sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
      }
      sqlToQuery(sql2, invokeSource) {
        return sql2.toQuery({
          casing: this.casing,
          escapeName: this.escapeName,
          escapeParam: this.escapeParam,
          escapeString: this.escapeString,
          invokeSource
        });
      }
      buildRelationalQuery({
        fullSchema,
        schema,
        tableNamesMap,
        table,
        tableConfig,
        queryConfig: config,
        tableAlias,
        nestedQueryRelation,
        joinOn
      }) {
        let selection = [];
        let limit, offset, orderBy = [], where;
        const joins = [];
        if (config === true) {
          const selectionEntries = Object.entries(tableConfig.columns);
          selection = selectionEntries.map(([key, value]) => ({
            dbKey: value.name,
            tsKey: key,
            field: aliasedTableColumn(value, tableAlias),
            relationTableTsKey: void 0,
            isJson: false,
            selection: []
          }));
        } else {
          const aliasedColumns = Object.fromEntries(
            Object.entries(tableConfig.columns).map(([key, value]) => [
              key,
              aliasedTableColumn(value, tableAlias)
            ])
          );
          if (config.where) {
            const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
            where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
          }
          const fieldsSelection = [];
          let selectedColumns = [];
          if (config.columns) {
            let isIncludeMode = false;
            for (const [field, value] of Object.entries(config.columns)) {
              if (value === void 0) {
                continue;
              }
              if (field in tableConfig.columns) {
                if (!isIncludeMode && value === true) {
                  isIncludeMode = true;
                }
                selectedColumns.push(field);
              }
            }
            if (selectedColumns.length > 0) {
              selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter(
                (key) => !selectedColumns.includes(key)
              );
            }
          } else {
            selectedColumns = Object.keys(tableConfig.columns);
          }
          for (const field of selectedColumns) {
            const column = tableConfig.columns[field];
            fieldsSelection.push({ tsKey: field, value: column });
          }
          let selectedRelations = [];
          if (config.with) {
            selectedRelations = Object.entries(config.with).filter(
              (entry) => !!entry[1]
            ).map(([tsKey, queryConfig]) => ({
              tsKey,
              queryConfig,
              relation: tableConfig.relations[tsKey]
            }));
          }
          let extras;
          if (config.extras) {
            extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
            for (const [tsKey, value] of Object.entries(extras)) {
              fieldsSelection.push({
                tsKey,
                value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
              });
            }
          }
          for (const { tsKey, value } of fieldsSelection) {
            selection.push({
              dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
              tsKey,
              field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
              relationTableTsKey: void 0,
              isJson: false,
              selection: []
            });
          }
          let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
          if (!Array.isArray(orderByOrig)) {
            orderByOrig = [orderByOrig];
          }
          orderBy = orderByOrig.map((orderByValue) => {
            if (is(orderByValue, Column)) {
              return aliasedTableColumn(orderByValue, tableAlias);
            }
            return mapColumnsInSQLToAlias(orderByValue, tableAlias);
          });
          limit = config.limit;
          offset = config.offset;
          for (const {
            tsKey: selectedRelationTsKey,
            queryConfig: selectedRelationConfigValue,
            relation
          } of selectedRelations) {
            const normalizedRelation = normalizeRelation(
              schema,
              tableNamesMap,
              relation
            );
            const relationTableName = getTableUniqueName(relation.referencedTable);
            const relationTableTsName = tableNamesMap[relationTableName];
            const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
            const joinOn2 = and(
              ...normalizedRelation.fields.map(
                (field2, i) => eq(
                  aliasedTableColumn(
                    normalizedRelation.references[i],
                    relationTableAlias
                  ),
                  aliasedTableColumn(field2, tableAlias)
                )
              )
            );
            const builtRelation = this.buildRelationalQuery({
              fullSchema,
              schema,
              tableNamesMap,
              table: fullSchema[relationTableTsName],
              tableConfig: schema[relationTableTsName],
              queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
              tableAlias: relationTableAlias,
              joinOn: joinOn2,
              nestedQueryRelation: relation
            });
            const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
            selection.push({
              dbKey: selectedRelationTsKey,
              tsKey: selectedRelationTsKey,
              field,
              relationTableTsKey: relationTableTsName,
              isJson: true,
              selection: builtRelation.selection
            });
          }
        }
        if (selection.length === 0) {
          throw new DrizzleError({
            message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
          });
        }
        let result;
        where = and(joinOn, where);
        if (nestedQueryRelation) {
          let field = sql`json_array(${sql.join(
            selection.map(
              ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(this.casing.getColumnCasing(field2)) : is(field2, SQL.Aliased) ? field2.sql : field2
            ),
            sql`, `
          )})`;
          if (is(nestedQueryRelation, Many)) {
            field = sql`coalesce(json_group_array(${field}), json_array())`;
          }
          const nestedSelection = [
            {
              dbKey: "data",
              tsKey: "data",
              field: field.as("data"),
              isJson: true,
              relationTableTsKey: tableConfig.tsName,
              selection
            }
          ];
          const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
          if (needsSubquery) {
            result = this.buildSelectQuery({
              table: aliasedTable(table, tableAlias),
              fields: {},
              fieldsFlat: [
                {
                  path: [],
                  field: sql.raw("*")
                }
              ],
              where,
              limit,
              offset,
              orderBy,
              setOperators: []
            });
            where = void 0;
            limit = void 0;
            offset = void 0;
            orderBy = void 0;
          } else {
            result = aliasedTable(table, tableAlias);
          }
          result = this.buildSelectQuery({
            table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
            fields: {},
            fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
              path: [],
              field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
            })),
            joins,
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
        } else {
          result = this.buildSelectQuery({
            table: aliasedTable(table, tableAlias),
            fields: {},
            fieldsFlat: selection.map(({ field }) => ({
              path: [],
              field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
            })),
            joins,
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
        }
        return {
          tableTsKey: tableConfig.tsName,
          sql: result,
          selection
        };
      }
    };
    SQLiteSyncDialect = class extends SQLiteDialect {
      static {
        __name(this, "SQLiteSyncDialect");
      }
      static [entityKind] = "SQLiteSyncDialect";
      migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        session.run(migrationTableCreate);
        const dbMigrations = session.values(
          sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
        );
        const lastDbMigration = dbMigrations[0] ?? void 0;
        session.run(sql`BEGIN`);
        try {
          for (const migration of migrations) {
            if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
              for (const stmt of migration.sql) {
                session.run(sql.raw(stmt));
              }
              session.run(
                sql`INSERT INTO ${sql.identifier(
                  migrationsTable
                )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
              );
            }
          }
          session.run(sql`COMMIT`);
        } catch (e) {
          session.run(sql`ROLLBACK`);
          throw e;
        }
      }
    };
    SQLiteAsyncDialect = class extends SQLiteDialect {
      static {
        __name(this, "SQLiteAsyncDialect");
      }
      static [entityKind] = "SQLiteAsyncDialect";
      async migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        await session.run(migrationTableCreate);
        const dbMigrations = await session.values(
          sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
        );
        const lastDbMigration = dbMigrations[0] ?? void 0;
        await session.transaction(async (tx) => {
          for (const migration of migrations) {
            if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
              for (const stmt of migration.sql) {
                await tx.run(sql.raw(stmt));
              }
              await tx.run(
                sql`INSERT INTO ${sql.identifier(
                  migrationsTable
                )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
              );
            }
          }
        });
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder;
var init_query_builder = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/query-builders/query-builder.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    TypedQueryBuilder = class {
      static {
        __name(this, "TypedQueryBuilder");
      }
      static [entityKind] = "TypedQueryBuilder";
      /** @internal */
      getSelectedFields() {
        return this._.selectedFields;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/select.js
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var SQLiteSelectBuilder, SQLiteSelectQueryBuilderBase, SQLiteSelectBase, getSQLiteSetOperators, union, unionAll, intersect, except;
var init_select2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/select.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_query_builder();
    init_query_promise();
    init_selection_proxy();
    init_sql();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_utils2();
    init_view_base();
    SQLiteSelectBuilder = class {
      static {
        __name(this, "SQLiteSelectBuilder");
      }
      static [entityKind] = "SQLiteSelectBuilder";
      fields;
      session;
      dialect;
      withList;
      distinct;
      constructor(config) {
        this.fields = config.fields;
        this.session = config.session;
        this.dialect = config.dialect;
        this.withList = config.withList;
        this.distinct = config.distinct;
      }
      from(source) {
        const isPartialSelect = !!this.fields;
        let fields;
        if (this.fields) {
          fields = this.fields;
        } else if (is(source, Subquery)) {
          fields = Object.fromEntries(
            Object.keys(source._.selectedFields).map((key) => [key, source[key]])
          );
        } else if (is(source, SQLiteViewBase)) {
          fields = source[ViewBaseConfig].selectedFields;
        } else if (is(source, SQL)) {
          fields = {};
        } else {
          fields = getTableColumns(source);
        }
        return new SQLiteSelectBase({
          table: source,
          fields,
          isPartialSelect,
          session: this.session,
          dialect: this.dialect,
          withList: this.withList,
          distinct: this.distinct
        });
      }
    };
    SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
      static {
        __name(this, "SQLiteSelectQueryBuilderBase");
      }
      static [entityKind] = "SQLiteSelectQueryBuilder";
      _;
      /** @internal */
      config;
      joinsNotNullableMap;
      tableName;
      isPartialSelect;
      session;
      dialect;
      cacheConfig = void 0;
      usedTables = /* @__PURE__ */ new Set();
      constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
        super();
        this.config = {
          withList,
          table,
          fields: { ...fields },
          distinct,
          setOperators: []
        };
        this.isPartialSelect = isPartialSelect;
        this.session = session;
        this.dialect = dialect;
        this._ = {
          selectedFields: fields,
          config: this.config
        };
        this.tableName = getTableLikeName(table);
        this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
        for (const item of extractUsedTable(table)) this.usedTables.add(item);
      }
      /** @internal */
      getUsedTables() {
        return [...this.usedTables];
      }
      createJoin(joinType) {
        return (table, on) => {
          const baseTableName = this.tableName;
          const tableName = getTableLikeName(table);
          for (const item of extractUsedTable(table)) this.usedTables.add(item);
          if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
            throw new Error(`Alias "${tableName}" is already used in this query`);
          }
          if (!this.isPartialSelect) {
            if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
              this.config.fields = {
                [baseTableName]: this.config.fields
              };
            }
            if (typeof tableName === "string" && !is(table, SQL)) {
              const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
              this.config.fields[tableName] = selection;
            }
          }
          if (typeof on === "function") {
            on = on(
              new Proxy(
                this.config.fields,
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          if (!this.config.joins) {
            this.config.joins = [];
          }
          this.config.joins.push({ on, table, joinType, alias: tableName });
          if (typeof tableName === "string") {
            switch (joinType) {
              case "left": {
                this.joinsNotNullableMap[tableName] = false;
                break;
              }
              case "right": {
                this.joinsNotNullableMap = Object.fromEntries(
                  Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                );
                this.joinsNotNullableMap[tableName] = true;
                break;
              }
              case "cross":
              case "inner": {
                this.joinsNotNullableMap[tableName] = true;
                break;
              }
              case "full": {
                this.joinsNotNullableMap = Object.fromEntries(
                  Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                );
                this.joinsNotNullableMap[tableName] = false;
                break;
              }
            }
          }
          return this;
        };
      }
      /**
       * Executes a `left join` operation by adding another table to the current query.
       *
       * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
       *   .from(users)
       *   .leftJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .leftJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      leftJoin = this.createJoin("left");
      /**
       * Executes a `right join` operation by adding another table to the current query.
       *
       * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .rightJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .rightJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      rightJoin = this.createJoin("right");
      /**
       * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
       *
       * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .innerJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .innerJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      innerJoin = this.createJoin("inner");
      /**
       * Executes a `full join` operation by combining rows from two tables into a new table.
       *
       * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
       *   .from(users)
       *   .fullJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .fullJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      fullJoin = this.createJoin("full");
      /**
       * Executes a `cross join` operation by combining rows from two tables into a new table.
       *
       * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
       *
       * @param table the table to join.
       *
       * @example
       *
       * ```ts
       * // Select all users, each user with every pet
       * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .crossJoin(pets)
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .crossJoin(pets)
       * ```
       */
      crossJoin = this.createJoin("cross");
      createSetOperator(type, isAll) {
        return (rightSelection) => {
          const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
          if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
            throw new Error(
              "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
            );
          }
          this.config.setOperators.push({ type, isAll, rightSelect });
          return this;
        };
      }
      /**
       * Adds `union` set operator to the query.
       *
       * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
       *
       * @example
       *
       * ```ts
       * // Select all unique names from customers and users tables
       * await db.select({ name: users.name })
       *   .from(users)
       *   .union(
       *     db.select({ name: customers.name }).from(customers)
       *   );
       * // or
       * import { union } from 'drizzle-orm/sqlite-core'
       *
       * await union(
       *   db.select({ name: users.name }).from(users),
       *   db.select({ name: customers.name }).from(customers)
       * );
       * ```
       */
      union = this.createSetOperator("union", false);
      /**
       * Adds `union all` set operator to the query.
       *
       * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
       *
       * @example
       *
       * ```ts
       * // Select all transaction ids from both online and in-store sales
       * await db.select({ transaction: onlineSales.transactionId })
       *   .from(onlineSales)
       *   .unionAll(
       *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
       *   );
       * // or
       * import { unionAll } from 'drizzle-orm/sqlite-core'
       *
       * await unionAll(
       *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
       *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
       * );
       * ```
       */
      unionAll = this.createSetOperator("union", true);
      /**
       * Adds `intersect` set operator to the query.
       *
       * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
       *
       * @example
       *
       * ```ts
       * // Select course names that are offered in both departments A and B
       * await db.select({ courseName: depA.courseName })
       *   .from(depA)
       *   .intersect(
       *     db.select({ courseName: depB.courseName }).from(depB)
       *   );
       * // or
       * import { intersect } from 'drizzle-orm/sqlite-core'
       *
       * await intersect(
       *   db.select({ courseName: depA.courseName }).from(depA),
       *   db.select({ courseName: depB.courseName }).from(depB)
       * );
       * ```
       */
      intersect = this.createSetOperator("intersect", false);
      /**
       * Adds `except` set operator to the query.
       *
       * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
       *
       * @example
       *
       * ```ts
       * // Select all courses offered in department A but not in department B
       * await db.select({ courseName: depA.courseName })
       *   .from(depA)
       *   .except(
       *     db.select({ courseName: depB.courseName }).from(depB)
       *   );
       * // or
       * import { except } from 'drizzle-orm/sqlite-core'
       *
       * await except(
       *   db.select({ courseName: depA.courseName }).from(depA),
       *   db.select({ courseName: depB.courseName }).from(depB)
       * );
       * ```
       */
      except = this.createSetOperator("except", false);
      /** @internal */
      addSetOperators(setOperators) {
        this.config.setOperators.push(...setOperators);
        return this;
      }
      /**
       * Adds a `where` clause to the query.
       *
       * Calling this method will select only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
       *
       * @param where the `where` clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be selected.
       *
       * ```ts
       * // Select all cars with green color
       * await db.select().from(cars).where(eq(cars.color, 'green'));
       * // or
       * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Select all BMW cars with a green color
       * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Select all cars with the green or blue color
       * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        if (typeof where === "function") {
          where = where(
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
            )
          );
        }
        this.config.where = where;
        return this;
      }
      /**
       * Adds a `having` clause to the query.
       *
       * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
       *
       * @param having the `having` clause.
       *
       * @example
       *
       * ```ts
       * // Select all brands with more than one car
       * await db.select({
       * 	brand: cars.brand,
       * 	count: sql<number>`cast(count(${cars.id}) as int)`,
       * })
       *   .from(cars)
       *   .groupBy(cars.brand)
       *   .having(({ count }) => gt(count, 1));
       * ```
       */
      having(having) {
        if (typeof having === "function") {
          having = having(
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
            )
          );
        }
        this.config.having = having;
        return this;
      }
      groupBy(...columns) {
        if (typeof columns[0] === "function") {
          const groupBy = columns[0](
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
        } else {
          this.config.groupBy = columns;
        }
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).orderBy = orderByArray;
          } else {
            this.config.orderBy = orderByArray;
          }
        } else {
          const orderByArray = columns;
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).orderBy = orderByArray;
          } else {
            this.config.orderBy = orderByArray;
          }
        }
        return this;
      }
      /**
       * Adds a `limit` clause to the query.
       *
       * Calling this method will set the maximum number of rows that will be returned by this query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
       *
       * @param limit the `limit` clause.
       *
       * @example
       *
       * ```ts
       * // Get the first 10 people from this query.
       * await db.select().from(people).limit(10);
       * ```
       */
      limit(limit) {
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).limit = limit;
        } else {
          this.config.limit = limit;
        }
        return this;
      }
      /**
       * Adds an `offset` clause to the query.
       *
       * Calling this method will skip a number of rows when returning results from this query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
       *
       * @param offset the `offset` clause.
       *
       * @example
       *
       * ```ts
       * // Get the 10th-20th people from this query.
       * await db.select().from(people).offset(10).limit(10);
       * ```
       */
      offset(offset) {
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).offset = offset;
        } else {
          this.config.offset = offset;
        }
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildSelectQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      as(alias) {
        const usedTables = [];
        usedTables.push(...extractUsedTable(this.config.table));
        if (this.config.joins) {
          for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
        }
        return new Proxy(
          new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
      /** @internal */
      getSelectedFields() {
        return new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
      $dynamic() {
        return this;
      }
    };
    SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
      static {
        __name(this, "SQLiteSelectBase");
      }
      static [entityKind] = "SQLiteSelect";
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        if (!this.session) {
          throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
        }
        const fieldsList = orderSelectedFields(this.config.fields);
        const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          fieldsList,
          "all",
          true,
          void 0,
          {
            type: "select",
            tables: [...this.usedTables]
          },
          this.cacheConfig
        );
        query.joinsNotNullableMap = this.joinsNotNullableMap;
        return query;
      }
      $withCache(config) {
        this.cacheConfig = config === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config };
        return this;
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute() {
        return this.all();
      }
    };
    applyMixins(SQLiteSelectBase, [QueryPromise]);
    __name(createSetOperator, "createSetOperator");
    getSQLiteSetOperators = /* @__PURE__ */ __name(() => ({
      union,
      unionAll,
      intersect,
      except
    }), "getSQLiteSetOperators");
    union = createSetOperator("union", false);
    unionAll = createSetOperator("union", true);
    intersect = createSetOperator("intersect", false);
    except = createSetOperator("except", false);
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder;
var init_query_builder2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_selection_proxy();
    init_dialect();
    init_subquery();
    init_select2();
    QueryBuilder = class {
      static {
        __name(this, "QueryBuilder");
      }
      static [entityKind] = "SQLiteQueryBuilder";
      dialect;
      dialectConfig;
      constructor(dialect) {
        this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
        this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
      }
      $with = /* @__PURE__ */ __name((alias, selection) => {
        const queryBuilder = this;
        const as = /* @__PURE__ */ __name((qb) => {
          if (typeof qb === "function") {
            qb = qb(queryBuilder);
          }
          return new Proxy(
            new WithSubquery(
              qb.getSQL(),
              selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
              alias,
              true
            ),
            new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        }, "as");
        return { as };
      }, "$with");
      with(...queries) {
        const self = this;
        function select(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: self.getDialect(),
            withList: queries
          });
        }
        __name(select, "select");
        function selectDistinct(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: self.getDialect(),
            withList: queries,
            distinct: true
          });
        }
        __name(selectDistinct, "selectDistinct");
        return { select, selectDistinct };
      }
      select(fields) {
        return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
      }
      selectDistinct(fields) {
        return new SQLiteSelectBuilder({
          fields: fields ?? void 0,
          session: void 0,
          dialect: this.getDialect(),
          distinct: true
        });
      }
      // Lazy load dialect to avoid circular dependency
      getDialect() {
        if (!this.dialect) {
          this.dialect = new SQLiteSyncDialect(this.dialectConfig);
        }
        return this.dialect;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder, SQLiteInsertBase;
var init_insert = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/insert.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_query_promise();
    init_sql();
    init_table3();
    init_table();
    init_utils();
    init_utils2();
    init_query_builder2();
    SQLiteInsertBuilder = class {
      static {
        __name(this, "SQLiteInsertBuilder");
      }
      constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
      }
      static [entityKind] = "SQLiteInsertBuilder";
      values(values) {
        values = Array.isArray(values) ? values : [values];
        if (values.length === 0) {
          throw new Error("values() must be called with at least one value");
        }
        const mappedValues = values.map((entry) => {
          const result = {};
          const cols = this.table[Table.Symbol.Columns];
          for (const colKey of Object.keys(entry)) {
            const colValue = entry[colKey];
            result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
          }
          return result;
        });
        return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
      }
      select(selectQuery) {
        const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
        if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
          throw new Error(
            "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
          );
        }
        return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
      }
    };
    SQLiteInsertBase = class extends QueryPromise {
      static {
        __name(this, "SQLiteInsertBase");
      }
      constructor(table, values, session, dialect, withList, select) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table, values, withList, select };
      }
      static [entityKind] = "SQLiteInsert";
      /** @internal */
      config;
      returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /**
       * Adds an `on conflict do nothing` clause to the query.
       *
       * Calling this method simply avoids inserting a row as its alternative action.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
       *
       * @param config The `target` and `where` clauses.
       *
       * @example
       * ```ts
       * // Insert one row and cancel the insert if there's a conflict
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoNothing();
       *
       * // Explicitly specify conflict target
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoNothing({ target: cars.id });
       * ```
       */
      onConflictDoNothing(config = {}) {
        if (!this.config.onConflict) this.config.onConflict = [];
        if (config.target === void 0) {
          this.config.onConflict.push(sql` on conflict do nothing`);
        } else {
          const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
          const whereSql = config.where ? sql` where ${config.where}` : sql``;
          this.config.onConflict.push(sql` on conflict ${targetSql} do nothing${whereSql}`);
        }
        return this;
      }
      /**
       * Adds an `on conflict do update` clause to the query.
       *
       * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
       *
       * @param config The `target`, `set` and `where` clauses.
       *
       * @example
       * ```ts
       * // Update the row if there's a conflict
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoUpdate({
       *     target: cars.id,
       *     set: { brand: 'Porsche' }
       *   });
       *
       * // Upsert with 'where' clause
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoUpdate({
       *     target: cars.id,
       *     set: { brand: 'newBMW' },
       *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
       *   });
       * ```
       */
      onConflictDoUpdate(config) {
        if (config.where && (config.targetWhere || config.setWhere)) {
          throw new Error(
            'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
          );
        }
        if (!this.config.onConflict) this.config.onConflict = [];
        const whereSql = config.where ? sql` where ${config.where}` : void 0;
        const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
        const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
        const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
        const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
        this.config.onConflict.push(
          sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`
        );
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildInsertQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "insert",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute() {
        return this.config.returning ? this.all() : this.run();
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/select.types.js
var init_select_types = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/select.types.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var SQLiteUpdateBuilder, SQLiteUpdateBase;
var init_update = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/update.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_query_promise();
    init_selection_proxy();
    init_table3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_utils2();
    init_view_base();
    SQLiteUpdateBuilder = class {
      static {
        __name(this, "SQLiteUpdateBuilder");
      }
      constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
      }
      static [entityKind] = "SQLiteUpdateBuilder";
      set(values) {
        return new SQLiteUpdateBase(
          this.table,
          mapUpdateSet(this.table, values),
          this.session,
          this.dialect,
          this.withList
        );
      }
    };
    SQLiteUpdateBase = class extends QueryPromise {
      static {
        __name(this, "SQLiteUpdateBase");
      }
      constructor(table, set, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { set, table, withList, joins: [] };
      }
      static [entityKind] = "SQLiteUpdate";
      /** @internal */
      config;
      from(source) {
        this.config.from = source;
        return this;
      }
      createJoin(joinType) {
        return (table, on) => {
          const tableName = getTableLikeName(table);
          if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
            throw new Error(`Alias "${tableName}" is already used in this query`);
          }
          if (typeof on === "function") {
            const from = this.config.from ? is(table, SQLiteTable) ? table[Table.Symbol.Columns] : is(table, Subquery) ? table._.selectedFields : is(table, SQLiteViewBase) ? table[ViewBaseConfig].selectedFields : void 0 : void 0;
            on = on(
              new Proxy(
                this.config.table[Table.Symbol.Columns],
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              ),
              from && new Proxy(
                from,
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          this.config.joins.push({ on, table, joinType, alias: tableName });
          return this;
        };
      }
      leftJoin = this.createJoin("left");
      rightJoin = this.createJoin("right");
      innerJoin = this.createJoin("inner");
      fullJoin = this.createJoin("full");
      /**
       * Adds a 'where' clause to the query.
       *
       * Calling this method will update only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/update}
       *
       * @param where the 'where' clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be updated.
       *
       * ```ts
       * // Update all cars with green color
       * db.update(cars).set({ color: 'red' })
       *   .where(eq(cars.color, 'green'));
       * // or
       * db.update(cars).set({ color: 'red' })
       *   .where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Update all BMW cars with a green color
       * db.update(cars).set({ color: 'red' })
       *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Update all cars with the green or blue color
       * db.update(cars).set({ color: 'red' })
       *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        this.config.where = where;
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.table[Table.Symbol.Columns],
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          this.config.orderBy = orderByArray;
        } else {
          const orderByArray = columns;
          this.config.orderBy = orderByArray;
        }
        return this;
      }
      limit(limit) {
        this.config.limit = limit;
        return this;
      }
      returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildUpdateQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "insert",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute() {
        return this.config.returning ? this.all() : this.run();
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/index.js
var init_query_builders = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_delete();
    init_insert();
    init_query_builder2();
    init_select2();
    init_select_types();
    init_update();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/count.js
var SQLiteCountBuilder;
var init_count = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/count.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_sql();
    SQLiteCountBuilder = class _SQLiteCountBuilder extends SQL {
      static {
        __name(this, "SQLiteCountBuilder");
      }
      constructor(params) {
        super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
        this.params = params;
        this.session = params.session;
        this.sql = _SQLiteCountBuilder.buildCount(
          params.source,
          params.filters
        );
      }
      sql;
      static [entityKind] = "SQLiteCountBuilderAsync";
      [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
      session;
      static buildEmbeddedCount(source, filters) {
        return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
      }
      static buildCount(source, filters) {
        return sql`select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters}`;
      }
      then(onfulfilled, onrejected) {
        return Promise.resolve(this.session.count(this.sql)).then(
          onfulfilled,
          onrejected
        );
      }
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var RelationalQueryBuilder, SQLiteRelationalQuery, SQLiteSyncRelationalQuery;
var init_query = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/query.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_query_promise();
    init_relations();
    RelationalQueryBuilder = class {
      static {
        __name(this, "RelationalQueryBuilder");
      }
      constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
        this.mode = mode;
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
      }
      static [entityKind] = "SQLiteAsyncRelationalQueryBuilder";
      findMany(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? config : {},
          "many"
        ) : new SQLiteRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? config : {},
          "many"
        );
      }
      findFirst(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? { ...config, limit: 1 } : { limit: 1 },
          "first"
        ) : new SQLiteRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? { ...config, limit: 1 } : { limit: 1 },
          "first"
        );
      }
    };
    SQLiteRelationalQuery = class extends QueryPromise {
      static {
        __name(this, "SQLiteRelationalQuery");
      }
      constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
        super();
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
        this.config = config;
        this.mode = mode;
      }
      static [entityKind] = "SQLiteAsyncRelationalQuery";
      /** @internal */
      mode;
      /** @internal */
      getSQL() {
        return this.dialect.buildRelationalQuery({
          fullSchema: this.fullSchema,
          schema: this.schema,
          tableNamesMap: this.tableNamesMap,
          table: this.table,
          tableConfig: this.tableConfig,
          queryConfig: this.config,
          tableAlias: this.tableConfig.tsName
        }).sql;
      }
      /** @internal */
      _prepare(isOneTimeQuery = false) {
        const { query, builtQuery } = this._toSQL();
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          builtQuery,
          void 0,
          this.mode === "first" ? "get" : "all",
          true,
          (rawRows, mapColumnValue) => {
            const rows = rawRows.map(
              (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
            );
            if (this.mode === "first") {
              return rows[0];
            }
            return rows;
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      _toSQL() {
        const query = this.dialect.buildRelationalQuery({
          fullSchema: this.fullSchema,
          schema: this.schema,
          tableNamesMap: this.tableNamesMap,
          table: this.table,
          tableConfig: this.tableConfig,
          queryConfig: this.config,
          tableAlias: this.tableConfig.tsName
        });
        const builtQuery = this.dialect.sqlToQuery(query.sql);
        return { query, builtQuery };
      }
      toSQL() {
        return this._toSQL().builtQuery;
      }
      /** @internal */
      executeRaw() {
        if (this.mode === "first") {
          return this._prepare(false).get();
        }
        return this._prepare(false).all();
      }
      async execute() {
        return this.executeRaw();
      }
    };
    SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
      static {
        __name(this, "SQLiteSyncRelationalQuery");
      }
      static [entityKind] = "SQLiteSyncRelationalQuery";
      sync() {
        return this.executeRaw();
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var SQLiteRaw;
var init_raw = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/query-builders/raw.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_query_promise();
    SQLiteRaw = class extends QueryPromise {
      static {
        __name(this, "SQLiteRaw");
      }
      constructor(execute, getSQL, action, dialect, mapBatchResult) {
        super();
        this.execute = execute;
        this.getSQL = getSQL;
        this.dialect = dialect;
        this.mapBatchResult = mapBatchResult;
        this.config = { action };
      }
      static [entityKind] = "SQLiteRaw";
      /** @internal */
      config;
      getQuery() {
        return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
      }
      mapResult(result, isFromBatch) {
        return isFromBatch ? this.mapBatchResult(result) : result;
      }
      _prepare() {
        return this;
      }
      /** @internal */
      isResponseInArrayMode() {
        return false;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/db.js
var BaseSQLiteDatabase;
var init_db = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/db.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_selection_proxy();
    init_sql();
    init_query_builders();
    init_subquery();
    init_count();
    init_query();
    init_raw();
    BaseSQLiteDatabase = class {
      static {
        __name(this, "BaseSQLiteDatabase");
      }
      constructor(resultKind, dialect, session, schema) {
        this.resultKind = resultKind;
        this.dialect = dialect;
        this.session = session;
        this._ = schema ? {
          schema: schema.schema,
          fullSchema: schema.fullSchema,
          tableNamesMap: schema.tableNamesMap
        } : {
          schema: void 0,
          fullSchema: {},
          tableNamesMap: {}
        };
        this.query = {};
        const query = this.query;
        if (this._.schema) {
          for (const [tableName, columns] of Object.entries(this._.schema)) {
            query[tableName] = new RelationalQueryBuilder(
              resultKind,
              schema.fullSchema,
              this._.schema,
              this._.tableNamesMap,
              schema.fullSchema[tableName],
              columns,
              dialect,
              session
            );
          }
        }
        this.$cache = { invalidate: /* @__PURE__ */ __name(async (_params) => {
        }, "invalidate") };
      }
      static [entityKind] = "BaseSQLiteDatabase";
      query;
      /**
       * Creates a subquery that defines a temporary named result set as a CTE.
       *
       * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
       *
       * @param alias The alias for the subquery.
       *
       * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
       *
       * @example
       *
       * ```ts
       * // Create a subquery with alias 'sq' and use it in the select query
       * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
       *
       * const result = await db.with(sq).select().from(sq);
       * ```
       *
       * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
       *
       * ```ts
       * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
       * const sq = db.$with('sq').as(db.select({
       *   name: sql<string>`upper(${users.name})`.as('name'),
       * })
       * .from(users));
       *
       * const result = await db.with(sq).select({ name: sq.name }).from(sq);
       * ```
       */
      $with = /* @__PURE__ */ __name((alias, selection) => {
        const self = this;
        const as = /* @__PURE__ */ __name((qb) => {
          if (typeof qb === "function") {
            qb = qb(new QueryBuilder(self.dialect));
          }
          return new Proxy(
            new WithSubquery(
              qb.getSQL(),
              selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
              alias,
              true
            ),
            new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        }, "as");
        return { as };
      }, "$with");
      $count(source, filters) {
        return new SQLiteCountBuilder({ source, filters, session: this.session });
      }
      /**
       * Incorporates a previously defined CTE (using `$with`) into the main query.
       *
       * This method allows the main query to reference a temporary named result set.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
       *
       * @param queries The CTEs to incorporate into the main query.
       *
       * @example
       *
       * ```ts
       * // Define a subquery 'sq' as a CTE using $with
       * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
       *
       * // Incorporate the CTE 'sq' into the main query and select from it
       * const result = await db.with(sq).select().from(sq);
       * ```
       */
      with(...queries) {
        const self = this;
        function select(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: self.session,
            dialect: self.dialect,
            withList: queries
          });
        }
        __name(select, "select");
        function selectDistinct(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: self.session,
            dialect: self.dialect,
            withList: queries,
            distinct: true
          });
        }
        __name(selectDistinct, "selectDistinct");
        function update(table) {
          return new SQLiteUpdateBuilder(table, self.session, self.dialect, queries);
        }
        __name(update, "update");
        function insert(into) {
          return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
        }
        __name(insert, "insert");
        function delete_(from) {
          return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
        }
        __name(delete_, "delete_");
        return { select, selectDistinct, update, insert, delete: delete_ };
      }
      select(fields) {
        return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
      }
      selectDistinct(fields) {
        return new SQLiteSelectBuilder({
          fields: fields ?? void 0,
          session: this.session,
          dialect: this.dialect,
          distinct: true
        });
      }
      /**
       * Creates an update query.
       *
       * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
       *
       * Use `.set()` method to specify which values to update.
       *
       * See docs: {@link https://orm.drizzle.team/docs/update}
       *
       * @param table The table to update.
       *
       * @example
       *
       * ```ts
       * // Update all rows in the 'cars' table
       * await db.update(cars).set({ color: 'red' });
       *
       * // Update rows with filters and conditions
       * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
       *
       * // Update with returning clause
       * const updatedCar: Car[] = await db.update(cars)
       *   .set({ color: 'red' })
       *   .where(eq(cars.id, 1))
       *   .returning();
       * ```
       */
      update(table) {
        return new SQLiteUpdateBuilder(table, this.session, this.dialect);
      }
      $cache;
      /**
       * Creates an insert query.
       *
       * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert}
       *
       * @param table The table to insert into.
       *
       * @example
       *
       * ```ts
       * // Insert one row
       * await db.insert(cars).values({ brand: 'BMW' });
       *
       * // Insert multiple rows
       * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
       *
       * // Insert with returning clause
       * const insertedCar: Car[] = await db.insert(cars)
       *   .values({ brand: 'BMW' })
       *   .returning();
       * ```
       */
      insert(into) {
        return new SQLiteInsertBuilder(into, this.session, this.dialect);
      }
      /**
       * Creates a delete query.
       *
       * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
       *
       * See docs: {@link https://orm.drizzle.team/docs/delete}
       *
       * @param table The table to delete from.
       *
       * @example
       *
       * ```ts
       * // Delete all rows in the 'cars' table
       * await db.delete(cars);
       *
       * // Delete rows with filters and conditions
       * await db.delete(cars).where(eq(cars.color, 'green'));
       *
       * // Delete with returning clause
       * const deletedCar: Car[] = await db.delete(cars)
       *   .where(eq(cars.id, 1))
       *   .returning();
       * ```
       */
      delete(from) {
        return new SQLiteDeleteBase(from, this.session, this.dialect);
      }
      run(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.run(sequel),
            () => sequel,
            "run",
            this.dialect,
            this.session.extractRawRunValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.run(sequel);
      }
      all(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.all(sequel),
            () => sequel,
            "all",
            this.dialect,
            this.session.extractRawAllValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.all(sequel);
      }
      get(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.get(sequel),
            () => sequel,
            "get",
            this.dialect,
            this.session.extractRawGetValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.get(sequel);
      }
      values(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.values(sequel),
            () => sequel,
            "values",
            this.dialect,
            this.session.extractRawValuesValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.values(sequel);
      }
      transaction(transaction, config) {
        return this.session.transaction(transaction, config);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/cache/core/cache.js
async function hashQuery(sql2, params) {
  const dataToHash = `${sql2}-${JSON.stringify(params)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
var Cache, NoopCache;
var init_cache = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/cache/core/cache.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    Cache = class {
      static {
        __name(this, "Cache");
      }
      static [entityKind] = "Cache";
    };
    NoopCache = class extends Cache {
      static {
        __name(this, "NoopCache");
      }
      strategy() {
        return "all";
      }
      static [entityKind] = "NoopCache";
      async get(_key) {
        return void 0;
      }
      async put(_hashedQuery, _response, _tables, _config) {
      }
      async onMutate(_params) {
      }
    };
    __name(hashQuery, "hashQuery");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/alias.js
var init_alias2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/alias.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/session.js
var ExecuteResultSync, SQLitePreparedQuery, SQLiteSession, SQLiteTransaction;
var init_session = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/session.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_cache();
    init_entity();
    init_errors();
    init_query_promise();
    init_db();
    ExecuteResultSync = class extends QueryPromise {
      static {
        __name(this, "ExecuteResultSync");
      }
      constructor(resultCb) {
        super();
        this.resultCb = resultCb;
      }
      static [entityKind] = "ExecuteResultSync";
      async execute() {
        return this.resultCb();
      }
      sync() {
        return this.resultCb();
      }
    };
    SQLitePreparedQuery = class {
      static {
        __name(this, "SQLitePreparedQuery");
      }
      constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
        this.mode = mode;
        this.executeMethod = executeMethod;
        this.query = query;
        this.cache = cache;
        this.queryMetadata = queryMetadata;
        this.cacheConfig = cacheConfig;
        if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
          this.cacheConfig = { enable: true, autoInvalidate: true };
        }
        if (!this.cacheConfig?.enable) {
          this.cacheConfig = void 0;
        }
      }
      static [entityKind] = "PreparedQuery";
      /** @internal */
      joinsNotNullableMap;
      /** @internal */
      async queryWithCache(queryString, params, query) {
        if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (this.cacheConfig && !this.cacheConfig.enable) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
          try {
            const [res] = await Promise.all([
              query(),
              this.cache.onMutate({ tables: this.queryMetadata.tables })
            ]);
            return res;
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (!this.cacheConfig) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (this.queryMetadata.type === "select") {
          const fromCache = await this.cache.get(
            this.cacheConfig.tag ?? await hashQuery(queryString, params),
            this.queryMetadata.tables,
            this.cacheConfig.tag !== void 0,
            this.cacheConfig.autoInvalidate
          );
          if (fromCache === void 0) {
            let result;
            try {
              result = await query();
            } catch (e) {
              throw new DrizzleQueryError(queryString, params, e);
            }
            await this.cache.put(
              this.cacheConfig.tag ?? await hashQuery(queryString, params),
              result,
              // make sure we send tables that were used in a query only if user wants to invalidate it on each write
              this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
              this.cacheConfig.tag !== void 0,
              this.cacheConfig.config
            );
            return result;
          }
          return fromCache;
        }
        try {
          return await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
      }
      getQuery() {
        return this.query;
      }
      mapRunResult(result, _isFromBatch) {
        return result;
      }
      mapAllResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
      }
      mapGetResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
      }
      execute(placeholderValues) {
        if (this.mode === "async") {
          return this[this.executeMethod](placeholderValues);
        }
        return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
      }
      mapResult(response, isFromBatch) {
        switch (this.executeMethod) {
          case "run": {
            return this.mapRunResult(response, isFromBatch);
          }
          case "all": {
            return this.mapAllResult(response, isFromBatch);
          }
          case "get": {
            return this.mapGetResult(response, isFromBatch);
          }
        }
      }
    };
    SQLiteSession = class {
      static {
        __name(this, "SQLiteSession");
      }
      constructor(dialect) {
        this.dialect = dialect;
      }
      static [entityKind] = "SQLiteSession";
      prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
        return this.prepareQuery(
          query,
          fields,
          executeMethod,
          isResponseInArrayMode,
          customResultMapper,
          queryMetadata,
          cacheConfig
        );
      }
      run(query) {
        const staticQuery = this.dialect.sqlToQuery(query);
        try {
          return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
        } catch (err) {
          throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
        }
      }
      /** @internal */
      extractRawRunValueFromBatchResult(result) {
        return result;
      }
      all(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
      }
      /** @internal */
      extractRawAllValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
      get(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
      }
      /** @internal */
      extractRawGetValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
      values(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
      }
      async count(sql2) {
        const result = await this.values(sql2);
        return result[0][0];
      }
      /** @internal */
      extractRawValuesValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
    };
    SQLiteTransaction = class extends BaseSQLiteDatabase {
      static {
        __name(this, "SQLiteTransaction");
      }
      constructor(resultType, dialect, session, schema, nestedIndex = 0) {
        super(resultType, dialect, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
      }
      static [entityKind] = "SQLiteTransaction";
      rollback() {
        throw new TransactionRollbackError();
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/subquery.js
var init_subquery2 = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/subquery.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/view.js
var ViewBuilderCore, ViewBuilder, ManualViewBuilder, SQLiteView;
var init_view = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/view.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_entity();
    init_selection_proxy();
    init_utils();
    init_query_builder2();
    init_table3();
    init_view_base();
    ViewBuilderCore = class {
      static {
        __name(this, "ViewBuilderCore");
      }
      constructor(name) {
        this.name = name;
      }
      static [entityKind] = "SQLiteViewBuilderCore";
      config = {};
    };
    ViewBuilder = class extends ViewBuilderCore {
      static {
        __name(this, "ViewBuilder");
      }
      static [entityKind] = "SQLiteViewBuilder";
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder());
        }
        const selectionProxy = new SelectionProxyHandler({
          alias: this.name,
          sqlBehavior: "error",
          sqlAliasedBehavior: "alias",
          replaceOriginalName: true
        });
        const aliasedSelectedFields = qb.getSelectedFields();
        return new Proxy(
          new SQLiteView({
            // sqliteConfig: this.config,
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: aliasedSelectedFields,
              query: qb.getSQL().inlineParams()
            }
          }),
          selectionProxy
        );
      }
    };
    ManualViewBuilder = class extends ViewBuilderCore {
      static {
        __name(this, "ManualViewBuilder");
      }
      static [entityKind] = "SQLiteManualViewBuilder";
      columns;
      constructor(name, columns) {
        super(name);
        this.columns = getTableColumns(sqliteTable(name, columns));
      }
      existing() {
        return new Proxy(
          new SQLiteView({
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: this.columns,
              query: void 0
            }
          }),
          new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          })
        );
      }
      as(query) {
        return new Proxy(
          new SQLiteView({
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: this.columns,
              query: query.inlineParams()
            }
          }),
          new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          })
        );
      }
    };
    SQLiteView = class extends SQLiteViewBase {
      static {
        __name(this, "SQLiteView");
      }
      static [entityKind] = "SQLiteView";
      constructor({ config }) {
        super(config);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/index.js
var init_sqlite_core = __esm({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sqlite-core/index.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_alias2();
    init_checks();
    init_columns();
    init_db();
    init_dialect();
    init_foreign_keys2();
    init_indexes();
    init_primary_keys2();
    init_query_builders();
    init_session();
    init_subquery2();
    init_table3();
    init_unique_constraint2();
    init_utils2();
    init_view();
  }
});

// ../../database/schema/auth.ts
var users, sessions;
var init_auth = __esm({
  "../../database/schema/auth.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    users = sqliteTable("users", {
      id: text("id").primaryKey(),
      // Usually a CUID or UUID
      email: text("email").notNull().unique(),
      passwordHash: text("password_hash").notNull(),
      displayName: text("display_name"),
      firstName: text("first_name"),
      lastName: text("last_name"),
      emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
      avatarUrl: text("avatar_url"),
      status: text("status", { enum: ["ACTIVE", "FROZEN", "BANNED", "PENDING_VERIFICATION"] }).notNull().default("ACTIVE"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
      lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
      mfaEnabled: integer("mfa_enabled", { mode: "boolean" }).notNull().default(false),
      mfaSecret: text("mfa_secret"),
      role: text("role", { enum: ["USER", "SUPER_ADMIN", "COMPLIANCE_ADMIN", "SUPPORT_ADMIN"] }).notNull().default("USER")
    });
    sessions = sqliteTable("sessions", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
      userAgent: text("user_agent"),
      ipAddress: text("ip_address"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/wallets.ts
var wallets, walletTransactions;
var init_wallets = __esm({
  "../../database/schema/wallets.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    wallets = sqliteTable("wallets", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      assetSymbol: text("asset_symbol").notNull(),
      type: text("type", { enum: ["REAL", "PAPER"] }).notNull().default("REAL"),
      balance: text("balance").notNull().default("0"),
      // stored as string to maintain precision
      lockedBalance: text("locked_balance").notNull().default("0"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
    walletTransactions = sqliteTable("wallet_transactions", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      type: text("type", { enum: ["DEPOSIT", "WITHDRAWAL", "TRADE", "P2P", "TRANSFER", "FEE", "REWARD", "ADJUSTMENT"] }).notNull(),
      mode: text("mode", { enum: ["REAL", "PAPER"] }).notNull().default("REAL"),
      assetSymbol: text("asset_symbol").notNull(),
      amount: text("amount").notNull(),
      fee: text("fee").notNull().default("0"),
      status: text("status", { enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REVERSED"] }).notNull(),
      destination: text("destination"),
      network: text("network"),
      reference: text("reference"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/kyc.ts
var kycProfiles;
var init_kyc = __esm({
  "../../database/schema/kyc.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    kycProfiles = sqliteTable("kyc_profiles", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      dateOfBirth: text("date_of_birth").notNull(),
      country: text("country").notNull(),
      documentType: text("document_type", { enum: ["PASSPORT", "ID_CARD", "DRIVERS_LICENSE"] }).notNull(),
      documentNumber: text("document_number").notNull(),
      documentFrontUrl: text("document_front_url").notNull(),
      documentBackUrl: text("document_back_url"),
      selfieUrl: text("selfie_url").notNull(),
      status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).notNull().default("PENDING"),
      reviewedBy: text("reviewed_by").references(() => users.id),
      rejectionReason: text("rejection_reason"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/ledger.ts
var ledgerAccounts, ledgerTransactions, ledgerEntries;
var init_ledger = __esm({
  "../../database/schema/ledger.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    ledgerAccounts = sqliteTable("ledger_accounts", {
      id: text("id").primaryKey(),
      userId: text("user_id").references(() => users.id),
      // null for system accounts
      type: text("type", { enum: ["USER", "SYSTEM_FEE", "SYSTEM_REVENUE", "SYSTEM_CUSTODY"] }).notNull(),
      assetSymbol: text("asset_symbol").notNull(),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
    ledgerTransactions = sqliteTable("ledger_transactions", {
      id: text("id").primaryKey(),
      idempotencyKey: text("idempotency_key").notNull().unique(),
      referenceType: text("reference_type", { enum: ["DEPOSIT", "WITHDRAWAL", "TRADE", "P2P_ESCROW", "FEE"] }).notNull(),
      referenceId: text("reference_id").notNull(),
      status: text("status", { enum: ["PENDING", "COMMITTED", "FAILED", "REVERSED"] }).notNull(),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
    ledgerEntries = sqliteTable("ledger_entries", {
      id: text("id").primaryKey(),
      transactionId: text("transaction_id").notNull().references(() => ledgerTransactions.id, { onDelete: "cascade" }),
      accountId: text("account_id").notNull().references(() => ledgerAccounts.id),
      direction: text("direction", { enum: ["DEBIT", "CREDIT"] }).notNull(),
      amount: text("amount").notNull(),
      assetSymbol: text("asset_symbol").notNull(),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/trading.ts
var markets, orders, trades;
var init_trading = __esm({
  "../../database/schema/trading.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    markets = sqliteTable("markets", {
      id: text("id").primaryKey(),
      symbol: text("symbol").notNull().unique(),
      // e.g. BTC-USDT
      baseAsset: text("base_asset").notNull(),
      // BTC
      quoteAsset: text("quote_asset").notNull(),
      // USDT
      status: text("status", { enum: ["ACTIVE", "PAUSED", "DELISTED"] }).notNull().default("ACTIVE"),
      minPrice: text("min_price").notNull(),
      maxPrice: text("max_price").notNull(),
      tickSize: text("tick_size").notNull(),
      minAmount: text("min_amount").notNull(),
      stepSize: text("step_size").notNull(),
      makerFee: text("maker_fee").notNull().default("0.001"),
      // 0.1%
      takerFee: text("taker_fee").notNull().default("0.001"),
      // 0.1%
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
    orders = sqliteTable("orders", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id),
      marketSymbol: text("market_symbol").notNull().references(() => markets.symbol),
      mode: text("mode", { enum: ["REAL", "PAPER"] }).notNull().default("REAL"),
      side: text("side", { enum: ["BUY", "SELL"] }).notNull(),
      type: text("type", { enum: ["MARKET", "LIMIT"] }).notNull(),
      status: text("status", { enum: ["OPEN", "FILLED", "CANCELED", "REJECTED"] }).notNull().default("OPEN"),
      price: text("price"),
      // null for market orders initially
      amount: text("amount").notNull(),
      // total amount placed
      filledAmount: text("filled_amount").notNull().default("0"),
      // amount executed so far
      remainingAmount: text("remaining_amount").notNull(),
      // amount - filledAmount
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
    trades = sqliteTable("trades", {
      id: text("id").primaryKey(),
      marketSymbol: text("market_symbol").notNull().references(() => markets.symbol),
      mode: text("mode", { enum: ["REAL", "PAPER"] }).notNull().default("REAL"),
      makerOrderId: text("maker_order_id").notNull().references(() => orders.id),
      takerOrderId: text("taker_order_id").notNull().references(() => orders.id),
      price: text("price").notNull(),
      amount: text("amount").notNull(),
      makerFee: text("maker_fee").notNull(),
      takerFee: text("taker_fee").notNull(),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/p2p.ts
var p2pAds, p2pOrders, p2pMessages;
var init_p2p = __esm({
  "../../database/schema/p2p.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    p2pAds = sqliteTable("p2p_ads", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id),
      type: text("type", { enum: ["BUY", "SELL"] }).notNull(),
      // Buy ad means creator wants to buy crypto with fiat
      asset: text("asset").notNull(),
      // crypto asset (e.g., USDT)
      fiat: text("fiat").notNull(),
      // fiat asset (e.g., USD, INR)
      price: text("price").notNull(),
      // fiat price per crypto
      totalAmount: text("total_amount").notNull(),
      // total crypto available in ad
      availableAmount: text("available_amount").notNull(),
      // remaining crypto
      minLimit: text("min_limit").notNull(),
      // min fiat amount per trade
      maxLimit: text("max_limit").notNull(),
      // max fiat amount per trade
      paymentMethods: text("payment_methods").notNull(),
      // JSON string array of supported methods
      terms: text("terms"),
      status: text("status", { enum: ["ACTIVE", "PAUSED", "COMPLETED", "CANCELED"] }).notNull().default("ACTIVE"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
    p2pOrders = sqliteTable("p2p_orders", {
      id: text("id").primaryKey(),
      adId: text("ad_id").notNull().references(() => p2pAds.id),
      buyerId: text("buyer_id").notNull().references(() => users.id),
      sellerId: text("seller_id").notNull().references(() => users.id),
      cryptoAmount: text("crypto_amount").notNull(),
      fiatAmount: text("fiat_amount").notNull(),
      price: text("price").notNull(),
      status: text("status", { enum: ["PENDING", "PAID", "RELEASED", "CANCELLED", "DISPUTED"] }).notNull().default("PENDING"),
      paymentMethod: text("payment_method").notNull(),
      // The selected method for this trade
      expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
      // Usually 15-30 mins after creation
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
    p2pMessages = sqliteTable("p2p_messages", {
      id: text("id").primaryKey(),
      orderId: text("order_id").notNull().references(() => p2pOrders.id, { onDelete: "cascade" }),
      senderId: text("sender_id").notNull().references(() => users.id),
      content: text("content").notNull(),
      attachmentUrl: text("attachment_url"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/notifications.ts
var notifications;
var init_notifications = __esm({
  "../../database/schema/notifications.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    notifications = sqliteTable("notifications", {
      id: text("id").primaryKey(),
      // Usually a CUID or UUID
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      title: text("title").notNull(),
      message: text("message").notNull(),
      type: text("type", { enum: ["SYSTEM", "TRADE", "DEPOSIT", "WITHDRAWAL", "SECURITY", "P2P"] }).notNull().default("SYSTEM"),
      isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/support.ts
var tickets, ticketMessages;
var init_support = __esm({
  "../../database/schema/support.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_sqlite_core();
    init_auth();
    tickets = sqliteTable("tickets", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      subject: text("subject").notNull(),
      category: text("category").notNull(),
      status: text("status", { enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] }).notNull().default("OPEN"),
      priority: text("priority", { enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }).notNull().default("MEDIUM"),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
    ticketMessages = sqliteTable("ticket_messages", {
      id: text("id").primaryKey(),
      ticketId: text("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
      senderId: text("sender_id").notNull().references(() => users.id),
      // Could be user or admin
      isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
      content: text("content").notNull(),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../../database/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  kycProfiles: () => kycProfiles,
  ledgerAccounts: () => ledgerAccounts,
  ledgerEntries: () => ledgerEntries,
  ledgerTransactions: () => ledgerTransactions,
  markets: () => markets,
  notifications: () => notifications,
  orders: () => orders,
  p2pAds: () => p2pAds,
  p2pMessages: () => p2pMessages,
  p2pOrders: () => p2pOrders,
  sessions: () => sessions,
  ticketMessages: () => ticketMessages,
  tickets: () => tickets,
  trades: () => trades,
  users: () => users,
  walletTransactions: () => walletTransactions,
  wallets: () => wallets
});
var init_schema = __esm({
  "../../database/schema/index.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_auth();
    init_wallets();
    init_kyc();
    init_ledger();
    init_trading();
    init_p2p();
    init_notifications();
    init_support();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/entity.cjs
var require_entity = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/entity.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var entity_exports = {};
    __export2(entity_exports, {
      entityKind: /* @__PURE__ */ __name(() => entityKind2, "entityKind"),
      hasOwnEntityKind: /* @__PURE__ */ __name(() => hasOwnEntityKind, "hasOwnEntityKind"),
      is: /* @__PURE__ */ __name(() => is2, "is")
    });
    module.exports = __toCommonJS2(entity_exports);
    var entityKind2 = /* @__PURE__ */ Symbol.for("drizzle:entityKind");
    var hasOwnEntityKind = /* @__PURE__ */ Symbol.for("drizzle:hasOwnEntityKind");
    function is2(value, type) {
      if (!value || typeof value !== "object") {
        return false;
      }
      if (value instanceof type) {
        return true;
      }
      if (!Object.prototype.hasOwnProperty.call(type, entityKind2)) {
        throw new Error(
          `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
        );
      }
      let cls = Object.getPrototypeOf(value).constructor;
      if (cls) {
        while (cls) {
          if (entityKind2 in cls && cls[entityKind2] === type[entityKind2]) {
            return true;
          }
          cls = Object.getPrototypeOf(cls);
        }
      }
      return false;
    }
    __name(is2, "is");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column.cjs
var require_column = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var column_exports = {};
    __export2(column_exports, {
      Column: /* @__PURE__ */ __name(() => Column2, "Column")
    });
    module.exports = __toCommonJS2(column_exports);
    var import_entity52 = require_entity();
    var Column2 = class {
      static {
        __name(this, "Column");
      }
      constructor(table, config) {
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.keyAsName = config.keyAsName;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.onUpdateFn = config.onUpdateFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
        this.generated = config.generated;
        this.generatedIdentity = config.generatedIdentity;
      }
      static [import_entity52.entityKind] = "Column";
      name;
      keyAsName;
      primary;
      notNull;
      default;
      defaultFn;
      onUpdateFn;
      hasDefault;
      isUnique;
      uniqueName;
      uniqueType;
      dataType;
      columnType;
      enumValues = void 0;
      generated = void 0;
      generatedIdentity = void 0;
      config;
      mapFromDriverValue(value) {
        return value;
      }
      mapToDriverValue(value) {
        return value;
      }
      // ** @internal */
      shouldDisableInsert() {
        return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column-builder.cjs
var require_column_builder = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/column-builder.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var column_builder_exports = {};
    __export2(column_builder_exports, {
      ColumnBuilder: /* @__PURE__ */ __name(() => ColumnBuilder2, "ColumnBuilder")
    });
    module.exports = __toCommonJS2(column_builder_exports);
    var import_entity52 = require_entity();
    var ColumnBuilder2 = class {
      static {
        __name(this, "ColumnBuilder");
      }
      static [import_entity52.entityKind] = "ColumnBuilder";
      config;
      constructor(name, dataType, columnType) {
        this.config = {
          name,
          keyAsName: name === "",
          notNull: false,
          default: void 0,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          uniqueName: void 0,
          uniqueType: void 0,
          dataType,
          columnType,
          generated: void 0
        };
      }
      /**
       * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
       *
       * @example
       * ```ts
       * const users = pgTable('users', {
       * 	id: integer('id').$type<UserId>().primaryKey(),
       * 	details: json('details').$type<UserDetails>().notNull(),
       * });
       * ```
       */
      $type() {
        return this;
      }
      /**
       * Adds a `not null` clause to the column definition.
       *
       * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
       */
      notNull() {
        this.config.notNull = true;
        return this;
      }
      /**
       * Adds a `default <value>` clause to the column definition.
       *
       * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
       *
       * If you need to set a dynamic default value, use {@link $defaultFn} instead.
       */
      default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Adds a dynamic default value to the column.
       * The function will be called when the row is inserted, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $defaultFn}.
       */
      $default = this.$defaultFn;
      /**
       * Adds a dynamic update value to the column.
       * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
       * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $onUpdateFn(fn) {
        this.config.onUpdateFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $onUpdateFn}.
       */
      $onUpdate = this.$onUpdateFn;
      /**
       * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
       *
       * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
       */
      primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
      }
      /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
      setName(name) {
        if (this.config.name !== "") return;
        this.config.name = name;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.utils.cjs
var require_table_utils = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.utils.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var table_utils_exports = {};
    __export2(table_utils_exports, {
      TableName: /* @__PURE__ */ __name(() => TableName2, "TableName")
    });
    module.exports = __toCommonJS2(table_utils_exports);
    var TableName2 = /* @__PURE__ */ Symbol.for("drizzle:Name");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/foreign-keys.cjs
var require_foreign_keys = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/foreign-keys.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var foreign_keys_exports = {};
    __export2(foreign_keys_exports, {
      ForeignKey: /* @__PURE__ */ __name(() => ForeignKey3, "ForeignKey"),
      ForeignKeyBuilder: /* @__PURE__ */ __name(() => ForeignKeyBuilder3, "ForeignKeyBuilder"),
      foreignKey: /* @__PURE__ */ __name(() => foreignKey, "foreignKey")
    });
    module.exports = __toCommonJS2(foreign_keys_exports);
    var import_entity52 = require_entity();
    var import_table_utils6 = require_table_utils();
    var ForeignKeyBuilder3 = class {
      static {
        __name(this, "ForeignKeyBuilder");
      }
      static [import_entity52.entityKind] = "PgForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate = "no action";
      /** @internal */
      _onDelete = "no action";
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action === void 0 ? "no action" : action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action === void 0 ? "no action" : action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey3(table, this);
      }
    };
    var ForeignKey3 = class {
      static {
        __name(this, "ForeignKey");
      }
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [import_entity52.entityKind] = "PgForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[import_table_utils6.TableName],
          ...columnNames,
          foreignColumns[0].table[import_table_utils6.TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
    function foreignKey(config) {
      function mappedConfig() {
        const { name, columns, foreignColumns } = config;
        return {
          name,
          columns,
          foreignColumns
        };
      }
      __name(mappedConfig, "mappedConfig");
      return new ForeignKeyBuilder3(mappedConfig);
    }
    __name(foreignKey, "foreignKey");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing-utils.cjs
var require_tracing_utils = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing-utils.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var tracing_utils_exports = {};
    __export2(tracing_utils_exports, {
      iife: /* @__PURE__ */ __name(() => iife2, "iife")
    });
    module.exports = __toCommonJS2(tracing_utils_exports);
    function iife2(fn, ...args) {
      return fn(...args);
    }
    __name(iife2, "iife");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/unique-constraint.cjs
var require_unique_constraint = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/unique-constraint.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var unique_constraint_exports = {};
    __export2(unique_constraint_exports, {
      UniqueConstraint: /* @__PURE__ */ __name(() => UniqueConstraint3, "UniqueConstraint"),
      UniqueConstraintBuilder: /* @__PURE__ */ __name(() => UniqueConstraintBuilder3, "UniqueConstraintBuilder"),
      UniqueOnConstraintBuilder: /* @__PURE__ */ __name(() => UniqueOnConstraintBuilder3, "UniqueOnConstraintBuilder"),
      unique: /* @__PURE__ */ __name(() => unique, "unique"),
      uniqueKeyName: /* @__PURE__ */ __name(() => uniqueKeyName3, "uniqueKeyName")
    });
    module.exports = __toCommonJS2(unique_constraint_exports);
    var import_entity52 = require_entity();
    var import_table_utils6 = require_table_utils();
    function unique(name) {
      return new UniqueOnConstraintBuilder3(name);
    }
    __name(unique, "unique");
    function uniqueKeyName3(table, columns) {
      return `${table[import_table_utils6.TableName]}_${columns.join("_")}_unique`;
    }
    __name(uniqueKeyName3, "uniqueKeyName");
    var UniqueConstraintBuilder3 = class {
      static {
        __name(this, "UniqueConstraintBuilder");
      }
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [import_entity52.entityKind] = "PgUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      nullsNotDistinctConfig = false;
      nullsNotDistinct() {
        this.nullsNotDistinctConfig = true;
        return this;
      }
      /** @internal */
      build(table) {
        return new UniqueConstraint3(table, this.columns, this.nullsNotDistinctConfig, this.name);
      }
    };
    var UniqueOnConstraintBuilder3 = class {
      static {
        __name(this, "UniqueOnConstraintBuilder");
      }
      static [import_entity52.entityKind] = "PgUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder3(columns, this.name);
      }
    };
    var UniqueConstraint3 = class {
      static {
        __name(this, "UniqueConstraint");
      }
      constructor(table, columns, nullsNotDistinct, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName3(this.table, this.columns.map((column) => column.name));
        this.nullsNotDistinct = nullsNotDistinct;
      }
      static [import_entity52.entityKind] = "PgUniqueConstraint";
      columns;
      name;
      nullsNotDistinct = false;
      getName() {
        return this.name;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/utils/array.cjs
var require_array = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/utils/array.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var array_exports = {};
    __export2(array_exports, {
      makePgArray: /* @__PURE__ */ __name(() => makePgArray2, "makePgArray"),
      parsePgArray: /* @__PURE__ */ __name(() => parsePgArray2, "parsePgArray"),
      parsePgNestedArray: /* @__PURE__ */ __name(() => parsePgNestedArray2, "parsePgNestedArray")
    });
    module.exports = __toCommonJS2(array_exports);
    function parsePgArrayValue2(arrayString, startFrom, inQuotes) {
      for (let i = startFrom; i < arrayString.length; i++) {
        const char = arrayString[i];
        if (char === "\\") {
          i++;
          continue;
        }
        if (char === '"') {
          return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
        }
        if (inQuotes) {
          continue;
        }
        if (char === "," || char === "}") {
          return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
        }
      }
      return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
    }
    __name(parsePgArrayValue2, "parsePgArrayValue");
    function parsePgNestedArray2(arrayString, startFrom = 0) {
      const result = [];
      let i = startFrom;
      let lastCharIsComma = false;
      while (i < arrayString.length) {
        const char = arrayString[i];
        if (char === ",") {
          if (lastCharIsComma || i === startFrom) {
            result.push("");
          }
          lastCharIsComma = true;
          i++;
          continue;
        }
        lastCharIsComma = false;
        if (char === "\\") {
          i += 2;
          continue;
        }
        if (char === '"') {
          const [value2, startFrom2] = parsePgArrayValue2(arrayString, i + 1, true);
          result.push(value2);
          i = startFrom2;
          continue;
        }
        if (char === "}") {
          return [result, i + 1];
        }
        if (char === "{") {
          const [value2, startFrom2] = parsePgNestedArray2(arrayString, i + 1);
          result.push(value2);
          i = startFrom2;
          continue;
        }
        const [value, newStartFrom] = parsePgArrayValue2(arrayString, i, false);
        result.push(value);
        i = newStartFrom;
      }
      return [result, i];
    }
    __name(parsePgNestedArray2, "parsePgNestedArray");
    function parsePgArray2(arrayString) {
      const [result] = parsePgNestedArray2(arrayString, 1);
      return result;
    }
    __name(parsePgArray2, "parsePgArray");
    function makePgArray2(array) {
      return `{${array.map((item) => {
        if (Array.isArray(item)) {
          return makePgArray2(item);
        }
        if (typeof item === "string") {
          return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        }
        return `${item}`;
      }).join(",")}}`;
    }
    __name(makePgArray2, "makePgArray");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/common.cjs
var require_common = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/common.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var common_exports = {};
    __export2(common_exports, {
      ExtraConfigColumn: /* @__PURE__ */ __name(() => ExtraConfigColumn2, "ExtraConfigColumn"),
      IndexedColumn: /* @__PURE__ */ __name(() => IndexedColumn2, "IndexedColumn"),
      PgArray: /* @__PURE__ */ __name(() => PgArray2, "PgArray"),
      PgArrayBuilder: /* @__PURE__ */ __name(() => PgArrayBuilder2, "PgArrayBuilder"),
      PgColumn: /* @__PURE__ */ __name(() => PgColumn2, "PgColumn"),
      PgColumnBuilder: /* @__PURE__ */ __name(() => PgColumnBuilder2, "PgColumnBuilder")
    });
    module.exports = __toCommonJS2(common_exports);
    var import_column_builder3 = require_column_builder();
    var import_column10 = require_column();
    var import_entity52 = require_entity();
    var import_foreign_keys3 = require_foreign_keys();
    var import_tracing_utils3 = require_tracing_utils();
    var import_unique_constraint3 = require_unique_constraint();
    var import_array2 = require_array();
    var PgColumnBuilder2 = class extends import_column_builder3.ColumnBuilder {
      static {
        __name(this, "PgColumnBuilder");
      }
      foreignKeyConfigs = [];
      static [import_entity52.entityKind] = "PgColumnBuilder";
      array(size) {
        return new PgArrayBuilder2(this.config.name, this, size);
      }
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
      }
      generatedAlwaysAs(as) {
        this.config.generated = {
          as,
          type: "always",
          mode: "stored"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return (0, import_tracing_utils3.iife)(
            (ref2, actions2) => {
              const builder = new import_foreign_keys3.ForeignKeyBuilder(() => {
                const foreignColumn = ref2();
                return { columns: [column], foreignColumns: [foreignColumn] };
              });
              if (actions2.onUpdate) {
                builder.onUpdate(actions2.onUpdate);
              }
              if (actions2.onDelete) {
                builder.onDelete(actions2.onDelete);
              }
              return builder.build(table);
            },
            ref,
            actions
          );
        });
      }
      /** @internal */
      buildExtraConfigColumn(table) {
        return new ExtraConfigColumn2(table, this.config);
      }
    };
    var PgColumn2 = class extends import_column10.Column {
      static {
        __name(this, "PgColumn");
      }
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = (0, import_unique_constraint3.uniqueKeyName)(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [import_entity52.entityKind] = "PgColumn";
    };
    var ExtraConfigColumn2 = class extends PgColumn2 {
      static {
        __name(this, "ExtraConfigColumn");
      }
      static [import_entity52.entityKind] = "ExtraConfigColumn";
      getSQLType() {
        return this.getSQLType();
      }
      indexConfig = {
        order: this.config.order ?? "asc",
        nulls: this.config.nulls ?? "last",
        opClass: this.config.opClass
      };
      defaultConfig = {
        order: "asc",
        nulls: "last",
        opClass: void 0
      };
      asc() {
        this.indexConfig.order = "asc";
        return this;
      }
      desc() {
        this.indexConfig.order = "desc";
        return this;
      }
      nullsFirst() {
        this.indexConfig.nulls = "first";
        return this;
      }
      nullsLast() {
        this.indexConfig.nulls = "last";
        return this;
      }
      /**
       * ### PostgreSQL documentation quote
       *
       * > An operator class with optional parameters can be specified for each column of an index.
       * The operator class identifies the operators to be used by the index for that column.
       * For example, a B-tree index on four-byte integers would use the int4_ops class;
       * this operator class includes comparison functions for four-byte integers.
       * In practice the default operator class for the column's data type is usually sufficient.
       * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
       * For example, we might want to sort a complex-number data type either by absolute value or by real part.
       * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
       * More information about operator classes check:
       *
       * ### Useful links
       * https://www.postgresql.org/docs/current/sql-createindex.html
       *
       * https://www.postgresql.org/docs/current/indexes-opclass.html
       *
       * https://www.postgresql.org/docs/current/xindex.html
       *
       * ### Additional types
       * If you have the `pg_vector` extension installed in your database, you can use the
       * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
       *
       * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
       *
       * @param opClass
       * @returns
       */
      op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
      }
    };
    var IndexedColumn2 = class {
      static {
        __name(this, "IndexedColumn");
      }
      static [import_entity52.entityKind] = "IndexedColumn";
      constructor(name, keyAsName, type, indexConfig) {
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
      }
      name;
      keyAsName;
      type;
      indexConfig;
    };
    var PgArrayBuilder2 = class extends PgColumnBuilder2 {
      static {
        __name(this, "PgArrayBuilder");
      }
      static [import_entity52.entityKind] = "PgArrayBuilder";
      constructor(name, baseBuilder, size) {
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
      }
      /** @internal */
      build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray2(
          table,
          this.config,
          baseColumn
        );
      }
    };
    var PgArray2 = class _PgArray extends PgColumn2 {
      static {
        __name(this, "PgArray");
      }
      constructor(table, config, baseColumn, range) {
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
      }
      size;
      static [import_entity52.entityKind] = "PgArray";
      getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          value = (0, import_array2.parsePgArray)(value);
        }
        return value.map((v) => this.baseColumn.mapFromDriverValue(v));
      }
      mapToDriverValue(value, isNestedArray = false) {
        const a = value.map(
          (v) => v === null ? null : (0, import_entity52.is)(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
        );
        if (isNestedArray) return a;
        return (0, import_array2.makePgArray)(a);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/enum.cjs
var require_enum = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/enum.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var enum_exports = {};
    __export2(enum_exports, {
      PgEnumColumn: /* @__PURE__ */ __name(() => PgEnumColumn2, "PgEnumColumn"),
      PgEnumColumnBuilder: /* @__PURE__ */ __name(() => PgEnumColumnBuilder2, "PgEnumColumnBuilder"),
      PgEnumObjectColumn: /* @__PURE__ */ __name(() => PgEnumObjectColumn2, "PgEnumObjectColumn"),
      PgEnumObjectColumnBuilder: /* @__PURE__ */ __name(() => PgEnumObjectColumnBuilder2, "PgEnumObjectColumnBuilder"),
      isPgEnum: /* @__PURE__ */ __name(() => isPgEnum2, "isPgEnum"),
      pgEnum: /* @__PURE__ */ __name(() => pgEnum, "pgEnum"),
      pgEnumObjectWithSchema: /* @__PURE__ */ __name(() => pgEnumObjectWithSchema, "pgEnumObjectWithSchema"),
      pgEnumWithSchema: /* @__PURE__ */ __name(() => pgEnumWithSchema, "pgEnumWithSchema")
    });
    module.exports = __toCommonJS2(enum_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgEnumObjectColumnBuilder2 = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgEnumObjectColumnBuilder");
      }
      static [import_entity52.entityKind] = "PgEnumObjectColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumObjectColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumObjectColumn2(
          table,
          this.config
        );
      }
    };
    var PgEnumObjectColumn2 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgEnumObjectColumn");
      }
      static [import_entity52.entityKind] = "PgEnumObjectColumn";
      enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
    var isPgEnumSym2 = /* @__PURE__ */ Symbol.for("drizzle:isPgEnum");
    function isPgEnum2(obj) {
      return !!obj && typeof obj === "function" && isPgEnumSym2 in obj && obj[isPgEnumSym2] === true;
    }
    __name(isPgEnum2, "isPgEnum");
    var PgEnumColumnBuilder2 = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgEnumColumnBuilder");
      }
      static [import_entity52.entityKind] = "PgEnumColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumColumn2(
          table,
          this.config
        );
      }
    };
    var PgEnumColumn2 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgEnumColumn");
      }
      static [import_entity52.entityKind] = "PgEnumColumn";
      enum = this.config.enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
    function pgEnum(enumName, input) {
      return Array.isArray(input) ? pgEnumWithSchema(enumName, [...input], void 0) : pgEnumObjectWithSchema(enumName, input, void 0);
    }
    __name(pgEnum, "pgEnum");
    function pgEnumWithSchema(enumName, values, schema) {
      const enumInstance = Object.assign(
        (name) => new PgEnumColumnBuilder2(name ?? "", enumInstance),
        {
          enumName,
          enumValues: values,
          schema,
          [isPgEnumSym2]: true
        }
      );
      return enumInstance;
    }
    __name(pgEnumWithSchema, "pgEnumWithSchema");
    function pgEnumObjectWithSchema(enumName, values, schema) {
      const enumInstance = Object.assign(
        (name) => new PgEnumObjectColumnBuilder2(name ?? "", enumInstance),
        {
          enumName,
          enumValues: Object.values(values),
          schema,
          [isPgEnumSym2]: true
        }
      );
      return enumInstance;
    }
    __name(pgEnumObjectWithSchema, "pgEnumObjectWithSchema");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/subquery.cjs
var require_subquery = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/subquery.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var subquery_exports = {};
    __export2(subquery_exports, {
      Subquery: /* @__PURE__ */ __name(() => Subquery2, "Subquery"),
      WithSubquery: /* @__PURE__ */ __name(() => WithSubquery2, "WithSubquery")
    });
    module.exports = __toCommonJS2(subquery_exports);
    var import_entity52 = require_entity();
    var Subquery2 = class {
      static {
        __name(this, "Subquery");
      }
      static [import_entity52.entityKind] = "Subquery";
      constructor(sql2, fields, alias, isWith = false, usedTables = []) {
        this._ = {
          brand: "Subquery",
          sql: sql2,
          selectedFields: fields,
          alias,
          isWith,
          usedTables
        };
      }
      // getSQL(): SQL<unknown> {
      // 	return new SQL([this]);
      // }
    };
    var WithSubquery2 = class extends Subquery2 {
      static {
        __name(this, "WithSubquery");
      }
      static [import_entity52.entityKind] = "WithSubquery";
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/version.cjs
var require_version = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/version.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var version_exports = {};
    __export2(version_exports, {
      compatibilityVersion: /* @__PURE__ */ __name(() => compatibilityVersion, "compatibilityVersion"),
      npmVersion: /* @__PURE__ */ __name(() => version2, "npmVersion")
    });
    module.exports = __toCommonJS2(version_exports);
    var version2 = "0.45.2";
    var compatibilityVersion = 10;
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing.cjs
var require_tracing = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/tracing.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var tracing_exports = {};
    __export2(tracing_exports, {
      tracer: /* @__PURE__ */ __name(() => tracer2, "tracer")
    });
    module.exports = __toCommonJS2(tracing_exports);
    var import_tracing_utils3 = require_tracing_utils();
    var import_version2 = require_version();
    var otel2;
    var rawTracer2;
    var tracer2 = {
      startActiveSpan(name, fn) {
        if (!otel2) {
          return fn();
        }
        if (!rawTracer2) {
          rawTracer2 = otel2.trace.getTracer("drizzle-orm", import_version2.npmVersion);
        }
        return (0, import_tracing_utils3.iife)(
          (otel22, rawTracer22) => rawTracer22.startActiveSpan(
            name,
            (span) => {
              try {
                return fn(span);
              } catch (e) {
                span.setStatus({
                  code: otel22.SpanStatusCode.ERROR,
                  message: e instanceof Error ? e.message : "Unknown error"
                  // eslint-disable-line no-instanceof/no-instanceof
                });
                throw e;
              } finally {
                span.end();
              }
            }
          ),
          otel2,
          rawTracer2
        );
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/view-common.cjs
var require_view_common = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/view-common.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var view_common_exports = {};
    __export2(view_common_exports, {
      ViewBaseConfig: /* @__PURE__ */ __name(() => ViewBaseConfig2, "ViewBaseConfig")
    });
    module.exports = __toCommonJS2(view_common_exports);
    var ViewBaseConfig2 = /* @__PURE__ */ Symbol.for("drizzle:ViewBaseConfig");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.cjs
var require_table = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/table.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var table_exports = {};
    __export2(table_exports, {
      BaseName: /* @__PURE__ */ __name(() => BaseName2, "BaseName"),
      Columns: /* @__PURE__ */ __name(() => Columns2, "Columns"),
      ExtraConfigBuilder: /* @__PURE__ */ __name(() => ExtraConfigBuilder2, "ExtraConfigBuilder"),
      ExtraConfigColumns: /* @__PURE__ */ __name(() => ExtraConfigColumns2, "ExtraConfigColumns"),
      IsAlias: /* @__PURE__ */ __name(() => IsAlias2, "IsAlias"),
      OriginalName: /* @__PURE__ */ __name(() => OriginalName2, "OriginalName"),
      Schema: /* @__PURE__ */ __name(() => Schema2, "Schema"),
      Table: /* @__PURE__ */ __name(() => Table2, "Table"),
      getTableName: /* @__PURE__ */ __name(() => getTableName2, "getTableName"),
      getTableUniqueName: /* @__PURE__ */ __name(() => getTableUniqueName2, "getTableUniqueName"),
      isTable: /* @__PURE__ */ __name(() => isTable, "isTable")
    });
    module.exports = __toCommonJS2(table_exports);
    var import_entity52 = require_entity();
    var import_table_utils6 = require_table_utils();
    var Schema2 = /* @__PURE__ */ Symbol.for("drizzle:Schema");
    var Columns2 = /* @__PURE__ */ Symbol.for("drizzle:Columns");
    var ExtraConfigColumns2 = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigColumns");
    var OriginalName2 = /* @__PURE__ */ Symbol.for("drizzle:OriginalName");
    var BaseName2 = /* @__PURE__ */ Symbol.for("drizzle:BaseName");
    var IsAlias2 = /* @__PURE__ */ Symbol.for("drizzle:IsAlias");
    var ExtraConfigBuilder2 = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigBuilder");
    var IsDrizzleTable2 = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleTable");
    var Table2 = class {
      static {
        __name(this, "Table");
      }
      static [import_entity52.entityKind] = "Table";
      /** @internal */
      static Symbol = {
        Name: import_table_utils6.TableName,
        Schema: Schema2,
        OriginalName: OriginalName2,
        Columns: Columns2,
        ExtraConfigColumns: ExtraConfigColumns2,
        BaseName: BaseName2,
        IsAlias: IsAlias2,
        ExtraConfigBuilder: ExtraConfigBuilder2
      };
      /**
       * @internal
       * Can be changed if the table is aliased.
       */
      [import_table_utils6.TableName];
      /**
       * @internal
       * Used to store the original name of the table, before any aliasing.
       */
      [OriginalName2];
      /** @internal */
      [Schema2];
      /** @internal */
      [Columns2];
      /** @internal */
      [ExtraConfigColumns2];
      /**
       *  @internal
       * Used to store the table name before the transformation via the `tableCreator` functions.
       */
      [BaseName2];
      /** @internal */
      [IsAlias2] = false;
      /** @internal */
      [IsDrizzleTable2] = true;
      /** @internal */
      [ExtraConfigBuilder2] = void 0;
      constructor(name, schema, baseName) {
        this[import_table_utils6.TableName] = this[OriginalName2] = name;
        this[Schema2] = schema;
        this[BaseName2] = baseName;
      }
    };
    function isTable(table) {
      return typeof table === "object" && table !== null && IsDrizzleTable2 in table;
    }
    __name(isTable, "isTable");
    function getTableName2(table) {
      return table[import_table_utils6.TableName];
    }
    __name(getTableName2, "getTableName");
    function getTableUniqueName2(table) {
      return `${table[Schema2] ?? "public"}.${table[import_table_utils6.TableName]}`;
    }
    __name(getTableUniqueName2, "getTableUniqueName");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/sql.cjs
var require_sql = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/sql.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name2 in all)
        __defProp2(target, name2, { get: all[name2], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var sql_exports = {};
    __export2(sql_exports, {
      FakePrimitiveParam: /* @__PURE__ */ __name(() => FakePrimitiveParam2, "FakePrimitiveParam"),
      Name: /* @__PURE__ */ __name(() => Name2, "Name"),
      Param: /* @__PURE__ */ __name(() => Param2, "Param"),
      Placeholder: /* @__PURE__ */ __name(() => Placeholder2, "Placeholder"),
      SQL: /* @__PURE__ */ __name(() => SQL2, "SQL"),
      StringChunk: /* @__PURE__ */ __name(() => StringChunk2, "StringChunk"),
      View: /* @__PURE__ */ __name(() => View2, "View"),
      fillPlaceholders: /* @__PURE__ */ __name(() => fillPlaceholders2, "fillPlaceholders"),
      getViewName: /* @__PURE__ */ __name(() => getViewName, "getViewName"),
      isDriverValueEncoder: /* @__PURE__ */ __name(() => isDriverValueEncoder2, "isDriverValueEncoder"),
      isSQLWrapper: /* @__PURE__ */ __name(() => isSQLWrapper2, "isSQLWrapper"),
      isView: /* @__PURE__ */ __name(() => isView, "isView"),
      name: /* @__PURE__ */ __name(() => name, "name"),
      noopDecoder: /* @__PURE__ */ __name(() => noopDecoder2, "noopDecoder"),
      noopEncoder: /* @__PURE__ */ __name(() => noopEncoder2, "noopEncoder"),
      noopMapper: /* @__PURE__ */ __name(() => noopMapper2, "noopMapper"),
      param: /* @__PURE__ */ __name(() => param, "param"),
      placeholder: /* @__PURE__ */ __name(() => placeholder, "placeholder"),
      sql: /* @__PURE__ */ __name(() => sql2, "sql")
    });
    module.exports = __toCommonJS2(sql_exports);
    var import_entity52 = require_entity();
    var import_enum2 = require_enum();
    var import_subquery10 = require_subquery();
    var import_tracing2 = require_tracing();
    var import_view_common8 = require_view_common();
    var import_column10 = require_column();
    var import_table23 = require_table();
    var FakePrimitiveParam2 = class {
      static {
        __name(this, "FakePrimitiveParam");
      }
      static [import_entity52.entityKind] = "FakePrimitiveParam";
    };
    function isSQLWrapper2(value) {
      return value !== null && value !== void 0 && typeof value.getSQL === "function";
    }
    __name(isSQLWrapper2, "isSQLWrapper");
    function mergeQueries2(queries) {
      const result = { sql: "", params: [] };
      for (const query of queries) {
        result.sql += query.sql;
        result.params.push(...query.params);
        if (query.typings?.length) {
          if (!result.typings) {
            result.typings = [];
          }
          result.typings.push(...query.typings);
        }
      }
      return result;
    }
    __name(mergeQueries2, "mergeQueries");
    var StringChunk2 = class {
      static {
        __name(this, "StringChunk");
      }
      static [import_entity52.entityKind] = "StringChunk";
      value;
      constructor(value) {
        this.value = Array.isArray(value) ? value : [value];
      }
      getSQL() {
        return new SQL2([this]);
      }
    };
    var SQL2 = class _SQL {
      static {
        __name(this, "SQL");
      }
      constructor(queryChunks) {
        this.queryChunks = queryChunks;
        for (const chunk of queryChunks) {
          if ((0, import_entity52.is)(chunk, import_table23.Table)) {
            const schemaName = chunk[import_table23.Table.Symbol.Schema];
            this.usedTables.push(
              schemaName === void 0 ? chunk[import_table23.Table.Symbol.Name] : schemaName + "." + chunk[import_table23.Table.Symbol.Name]
            );
          }
        }
      }
      static [import_entity52.entityKind] = "SQL";
      /** @internal */
      decoder = noopDecoder2;
      shouldInlineParams = false;
      /** @internal */
      usedTables = [];
      append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
      }
      toQuery(config) {
        return import_tracing2.tracer.startActiveSpan("drizzle.buildSQL", (span) => {
          const query = this.buildQueryFromSourceParams(this.queryChunks, config);
          span?.setAttributes({
            "drizzle.query.text": query.sql,
            "drizzle.query.params": JSON.stringify(query.params)
          });
          return query;
        });
      }
      buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
          inlineParams: _config.inlineParams || this.shouldInlineParams,
          paramStartIndex: _config.paramStartIndex || { value: 0 }
        });
        const {
          casing,
          escapeName,
          escapeParam,
          prepareTyping,
          inlineParams,
          paramStartIndex
        } = config;
        return mergeQueries2(chunks.map((chunk) => {
          if ((0, import_entity52.is)(chunk, StringChunk2)) {
            return { sql: chunk.value.join(""), params: [] };
          }
          if ((0, import_entity52.is)(chunk, Name2)) {
            return { sql: escapeName(chunk.value), params: [] };
          }
          if (chunk === void 0) {
            return { sql: "", params: [] };
          }
          if (Array.isArray(chunk)) {
            const result = [new StringChunk2("(")];
            for (const [i, p] of chunk.entries()) {
              result.push(p);
              if (i < chunk.length - 1) {
                result.push(new StringChunk2(", "));
              }
            }
            result.push(new StringChunk2(")"));
            return this.buildQueryFromSourceParams(result, config);
          }
          if ((0, import_entity52.is)(chunk, _SQL)) {
            return this.buildQueryFromSourceParams(chunk.queryChunks, {
              ...config,
              inlineParams: inlineParams || chunk.shouldInlineParams
            });
          }
          if ((0, import_entity52.is)(chunk, import_table23.Table)) {
            const schemaName = chunk[import_table23.Table.Symbol.Schema];
            const tableName = chunk[import_table23.Table.Symbol.Name];
            return {
              sql: schemaName === void 0 || chunk[import_table23.IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
              params: []
            };
          }
          if ((0, import_entity52.is)(chunk, import_column10.Column)) {
            const columnName = casing.getColumnCasing(chunk);
            if (_config.invokeSource === "indexes") {
              return { sql: escapeName(columnName), params: [] };
            }
            const schemaName = chunk.table[import_table23.Table.Symbol.Schema];
            return {
              sql: chunk.table[import_table23.IsAlias] || schemaName === void 0 ? escapeName(chunk.table[import_table23.Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[import_table23.Table.Symbol.Name]) + "." + escapeName(columnName),
              params: []
            };
          }
          if ((0, import_entity52.is)(chunk, View2)) {
            const schemaName = chunk[import_view_common8.ViewBaseConfig].schema;
            const viewName = chunk[import_view_common8.ViewBaseConfig].name;
            return {
              sql: schemaName === void 0 || chunk[import_view_common8.ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
              params: []
            };
          }
          if ((0, import_entity52.is)(chunk, Param2)) {
            if ((0, import_entity52.is)(chunk.value, Placeholder2)) {
              return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
            }
            const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
            if ((0, import_entity52.is)(mappedValue, _SQL)) {
              return this.buildQueryFromSourceParams([mappedValue], config);
            }
            if (inlineParams) {
              return { sql: this.mapInlineParam(mappedValue, config), params: [] };
            }
            let typings = ["none"];
            if (prepareTyping) {
              typings = [prepareTyping(chunk.encoder)];
            }
            return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
          }
          if ((0, import_entity52.is)(chunk, Placeholder2)) {
            return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
          }
          if ((0, import_entity52.is)(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
            return { sql: escapeName(chunk.fieldAlias), params: [] };
          }
          if ((0, import_entity52.is)(chunk, import_subquery10.Subquery)) {
            if (chunk._.isWith) {
              return { sql: escapeName(chunk._.alias), params: [] };
            }
            return this.buildQueryFromSourceParams([
              new StringChunk2("("),
              chunk._.sql,
              new StringChunk2(") "),
              new Name2(chunk._.alias)
            ], config);
          }
          if ((0, import_enum2.isPgEnum)(chunk)) {
            if (chunk.schema) {
              return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
            }
            return { sql: escapeName(chunk.enumName), params: [] };
          }
          if (isSQLWrapper2(chunk)) {
            if (chunk.shouldOmitSQLParens?.()) {
              return this.buildQueryFromSourceParams([chunk.getSQL()], config);
            }
            return this.buildQueryFromSourceParams([
              new StringChunk2("("),
              chunk.getSQL(),
              new StringChunk2(")")
            ], config);
          }
          if (inlineParams) {
            return { sql: this.mapInlineParam(chunk, config), params: [] };
          }
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }));
      }
      mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
          return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
          return chunk.toString();
        }
        if (typeof chunk === "string") {
          return escapeString(chunk);
        }
        if (typeof chunk === "object") {
          const mappedValueAsString = chunk.toString();
          if (mappedValueAsString === "[object Object]") {
            return escapeString(JSON.stringify(chunk));
          }
          return escapeString(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
      }
      getSQL() {
        return this;
      }
      as(alias) {
        if (alias === void 0) {
          return this;
        }
        return new _SQL.Aliased(this, alias);
      }
      mapWith(decoder) {
        this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
        return this;
      }
      inlineParams() {
        this.shouldInlineParams = true;
        return this;
      }
      /**
       * This method is used to conditionally include a part of the query.
       *
       * @param condition - Condition to check
       * @returns itself if the condition is `true`, otherwise `undefined`
       */
      if(condition) {
        return condition ? this : void 0;
      }
    };
    var Name2 = class {
      static {
        __name(this, "Name");
      }
      constructor(value) {
        this.value = value;
      }
      static [import_entity52.entityKind] = "Name";
      brand;
      getSQL() {
        return new SQL2([this]);
      }
    };
    function name(value) {
      return new Name2(value);
    }
    __name(name, "name");
    function isDriverValueEncoder2(value) {
      return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
    }
    __name(isDriverValueEncoder2, "isDriverValueEncoder");
    var noopDecoder2 = {
      mapFromDriverValue: /* @__PURE__ */ __name((value) => value, "mapFromDriverValue")
    };
    var noopEncoder2 = {
      mapToDriverValue: /* @__PURE__ */ __name((value) => value, "mapToDriverValue")
    };
    var noopMapper2 = {
      ...noopDecoder2,
      ...noopEncoder2
    };
    var Param2 = class {
      static {
        __name(this, "Param");
      }
      /**
       * @param value - Parameter value
       * @param encoder - Encoder to convert the value to a driver parameter
       */
      constructor(value, encoder = noopEncoder2) {
        this.value = value;
        this.encoder = encoder;
      }
      static [import_entity52.entityKind] = "Param";
      brand;
      getSQL() {
        return new SQL2([this]);
      }
    };
    function param(value, encoder) {
      return new Param2(value, encoder);
    }
    __name(param, "param");
    function sql2(strings, ...params) {
      const queryChunks = [];
      if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
        queryChunks.push(new StringChunk2(strings[0]));
      }
      for (const [paramIndex, param2] of params.entries()) {
        queryChunks.push(param2, new StringChunk2(strings[paramIndex + 1]));
      }
      return new SQL2(queryChunks);
    }
    __name(sql2, "sql");
    ((sql22) => {
      function empty() {
        return new SQL2([]);
      }
      __name(empty, "empty");
      sql22.empty = empty;
      function fromList(list) {
        return new SQL2(list);
      }
      __name(fromList, "fromList");
      sql22.fromList = fromList;
      function raw2(str) {
        return new SQL2([new StringChunk2(str)]);
      }
      __name(raw2, "raw");
      sql22.raw = raw2;
      function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()) {
          if (i > 0 && separator !== void 0) {
            result.push(separator);
          }
          result.push(chunk);
        }
        return new SQL2(result);
      }
      __name(join, "join");
      sql22.join = join;
      function identifier(value) {
        return new Name2(value);
      }
      __name(identifier, "identifier");
      sql22.identifier = identifier;
      function placeholder2(name2) {
        return new Placeholder2(name2);
      }
      __name(placeholder2, "placeholder2");
      sql22.placeholder = placeholder2;
      function param2(value, encoder) {
        return new Param2(value, encoder);
      }
      __name(param2, "param2");
      sql22.param = param2;
    })(sql2 || (sql2 = {}));
    ((SQL22) => {
      class Aliased {
        static {
          __name(this, "Aliased");
        }
        constructor(sql22, fieldAlias) {
          this.sql = sql22;
          this.fieldAlias = fieldAlias;
        }
        static [import_entity52.entityKind] = "SQL.Aliased";
        /** @internal */
        isSelectionField = false;
        getSQL() {
          return this.sql;
        }
        /** @internal */
        clone() {
          return new Aliased(this.sql, this.fieldAlias);
        }
      }
      SQL22.Aliased = Aliased;
    })(SQL2 || (SQL2 = {}));
    var Placeholder2 = class {
      static {
        __name(this, "Placeholder");
      }
      constructor(name2) {
        this.name = name2;
      }
      static [import_entity52.entityKind] = "Placeholder";
      getSQL() {
        return new SQL2([this]);
      }
    };
    function placeholder(name2) {
      return new Placeholder2(name2);
    }
    __name(placeholder, "placeholder");
    function fillPlaceholders2(params, values) {
      return params.map((p) => {
        if ((0, import_entity52.is)(p, Placeholder2)) {
          if (!(p.name in values)) {
            throw new Error(`No value for placeholder "${p.name}" was provided`);
          }
          return values[p.name];
        }
        if ((0, import_entity52.is)(p, Param2) && (0, import_entity52.is)(p.value, Placeholder2)) {
          if (!(p.value.name in values)) {
            throw new Error(`No value for placeholder "${p.value.name}" was provided`);
          }
          return p.encoder.mapToDriverValue(values[p.value.name]);
        }
        return p;
      });
    }
    __name(fillPlaceholders2, "fillPlaceholders");
    var IsDrizzleView2 = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleView");
    var View2 = class {
      static {
        __name(this, "View");
      }
      static [import_entity52.entityKind] = "View";
      /** @internal */
      [import_view_common8.ViewBaseConfig];
      /** @internal */
      [IsDrizzleView2] = true;
      constructor({ name: name2, schema, selectedFields, query }) {
        this[import_view_common8.ViewBaseConfig] = {
          name: name2,
          originalName: name2,
          schema,
          selectedFields,
          query,
          isExisting: !query,
          isAlias: false
        };
      }
      getSQL() {
        return new SQL2([this]);
      }
    };
    function isView(view) {
      return typeof view === "object" && view !== null && IsDrizzleView2 in view;
    }
    __name(isView, "isView");
    function getViewName(view) {
      return view[import_view_common8.ViewBaseConfig].name;
    }
    __name(getViewName, "getViewName");
    import_column10.Column.prototype.getSQL = function() {
      return new SQL2([this]);
    };
    import_table23.Table.prototype.getSQL = function() {
      return new SQL2([this]);
    };
    import_subquery10.Subquery.prototype.getSQL = function() {
      return new SQL2([this]);
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/alias.cjs
var require_alias = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/alias.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var alias_exports = {};
    __export2(alias_exports, {
      ColumnAliasProxyHandler: /* @__PURE__ */ __name(() => ColumnAliasProxyHandler2, "ColumnAliasProxyHandler"),
      RelationTableAliasProxyHandler: /* @__PURE__ */ __name(() => RelationTableAliasProxyHandler2, "RelationTableAliasProxyHandler"),
      TableAliasProxyHandler: /* @__PURE__ */ __name(() => TableAliasProxyHandler2, "TableAliasProxyHandler"),
      aliasedRelation: /* @__PURE__ */ __name(() => aliasedRelation, "aliasedRelation"),
      aliasedTable: /* @__PURE__ */ __name(() => aliasedTable2, "aliasedTable"),
      aliasedTableColumn: /* @__PURE__ */ __name(() => aliasedTableColumn2, "aliasedTableColumn"),
      mapColumnsInAliasedSQLToAlias: /* @__PURE__ */ __name(() => mapColumnsInAliasedSQLToAlias2, "mapColumnsInAliasedSQLToAlias"),
      mapColumnsInSQLToAlias: /* @__PURE__ */ __name(() => mapColumnsInSQLToAlias2, "mapColumnsInSQLToAlias")
    });
    module.exports = __toCommonJS2(alias_exports);
    var import_column10 = require_column();
    var import_entity52 = require_entity();
    var import_sql17 = require_sql();
    var import_table23 = require_table();
    var import_view_common8 = require_view_common();
    var ColumnAliasProxyHandler2 = class {
      static {
        __name(this, "ColumnAliasProxyHandler");
      }
      constructor(table) {
        this.table = table;
      }
      static [import_entity52.entityKind] = "ColumnAliasProxyHandler";
      get(columnObj, prop) {
        if (prop === "table") {
          return this.table;
        }
        return columnObj[prop];
      }
    };
    var TableAliasProxyHandler2 = class {
      static {
        __name(this, "TableAliasProxyHandler");
      }
      constructor(alias, replaceOriginalName) {
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
      }
      static [import_entity52.entityKind] = "TableAliasProxyHandler";
      get(target, prop) {
        if (prop === import_table23.Table.Symbol.IsAlias) {
          return true;
        }
        if (prop === import_table23.Table.Symbol.Name) {
          return this.alias;
        }
        if (this.replaceOriginalName && prop === import_table23.Table.Symbol.OriginalName) {
          return this.alias;
        }
        if (prop === import_view_common8.ViewBaseConfig) {
          return {
            ...target[import_view_common8.ViewBaseConfig],
            name: this.alias,
            isAlias: true
          };
        }
        if (prop === import_table23.Table.Symbol.Columns) {
          const columns = target[import_table23.Table.Symbol.Columns];
          if (!columns) {
            return columns;
          }
          const proxiedColumns = {};
          Object.keys(columns).map((key) => {
            proxiedColumns[key] = new Proxy(
              columns[key],
              new ColumnAliasProxyHandler2(new Proxy(target, this))
            );
          });
          return proxiedColumns;
        }
        const value = target[prop];
        if ((0, import_entity52.is)(value, import_column10.Column)) {
          return new Proxy(value, new ColumnAliasProxyHandler2(new Proxy(target, this)));
        }
        return value;
      }
    };
    var RelationTableAliasProxyHandler2 = class {
      static {
        __name(this, "RelationTableAliasProxyHandler");
      }
      constructor(alias) {
        this.alias = alias;
      }
      static [import_entity52.entityKind] = "RelationTableAliasProxyHandler";
      get(target, prop) {
        if (prop === "sourceTable") {
          return aliasedTable2(target.sourceTable, this.alias);
        }
        return target[prop];
      }
    };
    function aliasedTable2(table, tableAlias) {
      return new Proxy(table, new TableAliasProxyHandler2(tableAlias, false));
    }
    __name(aliasedTable2, "aliasedTable");
    function aliasedRelation(relation, tableAlias) {
      return new Proxy(relation, new RelationTableAliasProxyHandler2(tableAlias));
    }
    __name(aliasedRelation, "aliasedRelation");
    function aliasedTableColumn2(column, tableAlias) {
      return new Proxy(
        column,
        new ColumnAliasProxyHandler2(new Proxy(column.table, new TableAliasProxyHandler2(tableAlias, false)))
      );
    }
    __name(aliasedTableColumn2, "aliasedTableColumn");
    function mapColumnsInAliasedSQLToAlias2(query, alias) {
      return new import_sql17.SQL.Aliased(mapColumnsInSQLToAlias2(query.sql, alias), query.fieldAlias);
    }
    __name(mapColumnsInAliasedSQLToAlias2, "mapColumnsInAliasedSQLToAlias");
    function mapColumnsInSQLToAlias2(query, alias) {
      return import_sql17.sql.join(query.queryChunks.map((c) => {
        if ((0, import_entity52.is)(c, import_column10.Column)) {
          return aliasedTableColumn2(c, alias);
        }
        if ((0, import_entity52.is)(c, import_sql17.SQL)) {
          return mapColumnsInSQLToAlias2(c, alias);
        }
        if ((0, import_entity52.is)(c, import_sql17.SQL.Aliased)) {
          return mapColumnsInAliasedSQLToAlias2(c, alias);
        }
        return c;
      }));
    }
    __name(mapColumnsInSQLToAlias2, "mapColumnsInSQLToAlias");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/errors.cjs
var require_errors = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/errors.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var errors_exports = {};
    __export2(errors_exports, {
      DrizzleError: /* @__PURE__ */ __name(() => DrizzleError2, "DrizzleError"),
      DrizzleQueryError: /* @__PURE__ */ __name(() => DrizzleQueryError2, "DrizzleQueryError"),
      TransactionRollbackError: /* @__PURE__ */ __name(() => TransactionRollbackError2, "TransactionRollbackError")
    });
    module.exports = __toCommonJS2(errors_exports);
    var import_entity52 = require_entity();
    var DrizzleError2 = class extends Error {
      static {
        __name(this, "DrizzleError");
      }
      static [import_entity52.entityKind] = "DrizzleError";
      constructor({ message, cause }) {
        super(message);
        this.name = "DrizzleError";
        this.cause = cause;
      }
    };
    var DrizzleQueryError2 = class _DrizzleQueryError extends Error {
      static {
        __name(this, "DrizzleQueryError");
      }
      constructor(query, params, cause) {
        super(`Failed query: ${query}
params: ${params}`);
        this.query = query;
        this.params = params;
        this.cause = cause;
        Error.captureStackTrace(this, _DrizzleQueryError);
        if (cause) this.cause = cause;
      }
    };
    var TransactionRollbackError2 = class extends DrizzleError2 {
      static {
        __name(this, "TransactionRollbackError");
      }
      static [import_entity52.entityKind] = "TransactionRollbackError";
      constructor() {
        super({ message: "Rollback" });
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/logger.cjs
var require_logger = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/logger.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var logger_exports = {};
    __export2(logger_exports, {
      ConsoleLogWriter: /* @__PURE__ */ __name(() => ConsoleLogWriter2, "ConsoleLogWriter"),
      DefaultLogger: /* @__PURE__ */ __name(() => DefaultLogger2, "DefaultLogger"),
      NoopLogger: /* @__PURE__ */ __name(() => NoopLogger2, "NoopLogger")
    });
    module.exports = __toCommonJS2(logger_exports);
    var import_entity52 = require_entity();
    var ConsoleLogWriter2 = class {
      static {
        __name(this, "ConsoleLogWriter");
      }
      static [import_entity52.entityKind] = "ConsoleLogWriter";
      write(message) {
        console.log(message);
      }
    };
    var DefaultLogger2 = class {
      static {
        __name(this, "DefaultLogger");
      }
      static [import_entity52.entityKind] = "DefaultLogger";
      writer;
      constructor(config) {
        this.writer = config?.writer ?? new ConsoleLogWriter2();
      }
      logQuery(query, params) {
        const stringifiedParams = params.map((p) => {
          try {
            return JSON.stringify(p);
          } catch {
            return String(p);
          }
        });
        const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
        this.writer.write(`Query: ${query}${paramsStr}`);
      }
    };
    var NoopLogger2 = class {
      static {
        __name(this, "NoopLogger");
      }
      static [import_entity52.entityKind] = "NoopLogger";
      logQuery() {
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/operations.cjs
var require_operations = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/operations.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var operations_exports = {};
    module.exports = __toCommonJS2(operations_exports);
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/query-promise.cjs
var require_query_promise = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/query-promise.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var query_promise_exports = {};
    __export2(query_promise_exports, {
      QueryPromise: /* @__PURE__ */ __name(() => QueryPromise2, "QueryPromise")
    });
    module.exports = __toCommonJS2(query_promise_exports);
    var import_entity52 = require_entity();
    var QueryPromise2 = class {
      static {
        __name(this, "QueryPromise");
      }
      static [import_entity52.entityKind] = "QueryPromise";
      [Symbol.toStringTag] = "QueryPromise";
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
      then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/utils.cjs
var require_utils = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/utils.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var utils_exports = {};
    __export2(utils_exports, {
      applyMixins: /* @__PURE__ */ __name(() => applyMixins2, "applyMixins"),
      getColumnNameAndConfig: /* @__PURE__ */ __name(() => getColumnNameAndConfig2, "getColumnNameAndConfig"),
      getTableColumns: /* @__PURE__ */ __name(() => getTableColumns2, "getTableColumns"),
      getTableLikeName: /* @__PURE__ */ __name(() => getTableLikeName2, "getTableLikeName"),
      getViewSelectedFields: /* @__PURE__ */ __name(() => getViewSelectedFields, "getViewSelectedFields"),
      haveSameKeys: /* @__PURE__ */ __name(() => haveSameKeys2, "haveSameKeys"),
      isConfig: /* @__PURE__ */ __name(() => isConfig, "isConfig"),
      mapResultRow: /* @__PURE__ */ __name(() => mapResultRow2, "mapResultRow"),
      mapUpdateSet: /* @__PURE__ */ __name(() => mapUpdateSet2, "mapUpdateSet"),
      orderSelectedFields: /* @__PURE__ */ __name(() => orderSelectedFields2, "orderSelectedFields"),
      textDecoder: /* @__PURE__ */ __name(() => textDecoder2, "textDecoder")
    });
    module.exports = __toCommonJS2(utils_exports);
    var import_column10 = require_column();
    var import_entity52 = require_entity();
    var import_sql17 = require_sql();
    var import_subquery10 = require_subquery();
    var import_table23 = require_table();
    var import_view_common8 = require_view_common();
    function mapResultRow2(columns, row, joinsNotNullableMap) {
      const nullifyMap = {};
      const result = columns.reduce(
        (result2, { path, field }, columnIndex) => {
          let decoder;
          if ((0, import_entity52.is)(field, import_column10.Column)) {
            decoder = field;
          } else if ((0, import_entity52.is)(field, import_sql17.SQL)) {
            decoder = field.decoder;
          } else if ((0, import_entity52.is)(field, import_subquery10.Subquery)) {
            decoder = field._.sql.decoder;
          } else {
            decoder = field.sql.decoder;
          }
          let node = result2;
          for (const [pathChunkIndex, pathChunk] of path.entries()) {
            if (pathChunkIndex < path.length - 1) {
              if (!(pathChunk in node)) {
                node[pathChunk] = {};
              }
              node = node[pathChunk];
            } else {
              const rawValue = row[columnIndex];
              const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
              if (joinsNotNullableMap && (0, import_entity52.is)(field, import_column10.Column) && path.length === 2) {
                const objectName = path[0];
                if (!(objectName in nullifyMap)) {
                  nullifyMap[objectName] = value === null ? (0, import_table23.getTableName)(field.table) : false;
                } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0, import_table23.getTableName)(field.table)) {
                  nullifyMap[objectName] = false;
                }
              }
            }
          }
          return result2;
        },
        {}
      );
      if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
        for (const [objectName, tableName] of Object.entries(nullifyMap)) {
          if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
            result[objectName] = null;
          }
        }
      }
      return result;
    }
    __name(mapResultRow2, "mapResultRow");
    function orderSelectedFields2(fields, pathPrefix) {
      return Object.entries(fields).reduce((result, [name, field]) => {
        if (typeof name !== "string") {
          return result;
        }
        const newPath = pathPrefix ? [...pathPrefix, name] : [name];
        if ((0, import_entity52.is)(field, import_column10.Column) || (0, import_entity52.is)(field, import_sql17.SQL) || (0, import_entity52.is)(field, import_sql17.SQL.Aliased) || (0, import_entity52.is)(field, import_subquery10.Subquery)) {
          result.push({ path: newPath, field });
        } else if ((0, import_entity52.is)(field, import_table23.Table)) {
          result.push(...orderSelectedFields2(field[import_table23.Table.Symbol.Columns], newPath));
        } else {
          result.push(...orderSelectedFields2(field, newPath));
        }
        return result;
      }, []);
    }
    __name(orderSelectedFields2, "orderSelectedFields");
    function haveSameKeys2(left, right) {
      const leftKeys = Object.keys(left);
      const rightKeys = Object.keys(right);
      if (leftKeys.length !== rightKeys.length) {
        return false;
      }
      for (const [index, key] of leftKeys.entries()) {
        if (key !== rightKeys[index]) {
          return false;
        }
      }
      return true;
    }
    __name(haveSameKeys2, "haveSameKeys");
    function mapUpdateSet2(table, values) {
      const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
        if ((0, import_entity52.is)(value, import_sql17.SQL) || (0, import_entity52.is)(value, import_column10.Column)) {
          return [key, value];
        } else {
          return [key, new import_sql17.Param(value, table[import_table23.Table.Symbol.Columns][key])];
        }
      });
      if (entries.length === 0) {
        throw new Error("No values to set");
      }
      return Object.fromEntries(entries);
    }
    __name(mapUpdateSet2, "mapUpdateSet");
    function applyMixins2(baseClass, extendedClasses) {
      for (const extendedClass of extendedClasses) {
        for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
          if (name === "constructor") continue;
          Object.defineProperty(
            baseClass.prototype,
            name,
            Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
          );
        }
      }
    }
    __name(applyMixins2, "applyMixins");
    function getTableColumns2(table) {
      return table[import_table23.Table.Symbol.Columns];
    }
    __name(getTableColumns2, "getTableColumns");
    function getViewSelectedFields(view) {
      return view[import_view_common8.ViewBaseConfig].selectedFields;
    }
    __name(getViewSelectedFields, "getViewSelectedFields");
    function getTableLikeName2(table) {
      return (0, import_entity52.is)(table, import_subquery10.Subquery) ? table._.alias : (0, import_entity52.is)(table, import_sql17.View) ? table[import_view_common8.ViewBaseConfig].name : (0, import_entity52.is)(table, import_sql17.SQL) ? void 0 : table[import_table23.Table.Symbol.IsAlias] ? table[import_table23.Table.Symbol.Name] : table[import_table23.Table.Symbol.BaseName];
    }
    __name(getTableLikeName2, "getTableLikeName");
    function getColumnNameAndConfig2(a, b) {
      return {
        name: typeof a === "string" && a.length > 0 ? a : "",
        config: typeof a === "object" ? a : b
      };
    }
    __name(getColumnNameAndConfig2, "getColumnNameAndConfig");
    function isConfig(data) {
      if (typeof data !== "object" || data === null) return false;
      if (data.constructor.name !== "Object") return false;
      if ("logger" in data) {
        const type = typeof data["logger"];
        if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined") return false;
        return true;
      }
      if ("schema" in data) {
        const type = typeof data["schema"];
        if (type !== "object" && type !== "undefined") return false;
        return true;
      }
      if ("casing" in data) {
        const type = typeof data["casing"];
        if (type !== "string" && type !== "undefined") return false;
        return true;
      }
      if ("mode" in data) {
        if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0) return false;
        return true;
      }
      if ("connection" in data) {
        const type = typeof data["connection"];
        if (type !== "string" && type !== "object" && type !== "undefined") return false;
        return true;
      }
      if ("client" in data) {
        const type = typeof data["client"];
        if (type !== "object" && type !== "function" && type !== "undefined") return false;
        return true;
      }
      if (Object.keys(data).length === 0) return true;
      return false;
    }
    __name(isConfig, "isConfig");
    var textDecoder2 = typeof TextDecoder === "undefined" ? null : new TextDecoder();
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/int.common.cjs
var require_int_common = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/int.common.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var int_common_exports = {};
    __export2(int_common_exports, {
      PgIntColumnBaseBuilder: /* @__PURE__ */ __name(() => PgIntColumnBaseBuilder, "PgIntColumnBaseBuilder")
    });
    module.exports = __toCommonJS2(int_common_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgIntColumnBaseBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgIntColumnBaseBuilder");
      }
      static [import_entity52.entityKind] = "PgIntColumnBaseBuilder";
      generatedAlwaysAsIdentity(sequence) {
        if (sequence) {
          const { name, ...options } = sequence;
          this.config.generatedIdentity = {
            type: "always",
            sequenceName: name,
            sequenceOptions: options
          };
        } else {
          this.config.generatedIdentity = {
            type: "always"
          };
        }
        this.config.hasDefault = true;
        this.config.notNull = true;
        return this;
      }
      generatedByDefaultAsIdentity(sequence) {
        if (sequence) {
          const { name, ...options } = sequence;
          this.config.generatedIdentity = {
            type: "byDefault",
            sequenceName: name,
            sequenceOptions: options
          };
        } else {
          this.config.generatedIdentity = {
            type: "byDefault"
          };
        }
        this.config.hasDefault = true;
        this.config.notNull = true;
        return this;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/bigint.cjs
var require_bigint = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/bigint.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var bigint_exports = {};
    __export2(bigint_exports, {
      PgBigInt53: /* @__PURE__ */ __name(() => PgBigInt53, "PgBigInt53"),
      PgBigInt53Builder: /* @__PURE__ */ __name(() => PgBigInt53Builder, "PgBigInt53Builder"),
      PgBigInt64: /* @__PURE__ */ __name(() => PgBigInt64, "PgBigInt64"),
      PgBigInt64Builder: /* @__PURE__ */ __name(() => PgBigInt64Builder, "PgBigInt64Builder"),
      bigint: /* @__PURE__ */ __name(() => bigint, "bigint")
    });
    module.exports = __toCommonJS2(bigint_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var import_int_common = require_int_common();
    var PgBigInt53Builder = class extends import_int_common.PgIntColumnBaseBuilder {
      static {
        __name(this, "PgBigInt53Builder");
      }
      static [import_entity52.entityKind] = "PgBigInt53Builder";
      constructor(name) {
        super(name, "number", "PgBigInt53");
      }
      /** @internal */
      build(table) {
        return new PgBigInt53(table, this.config);
      }
    };
    var PgBigInt53 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgBigInt53");
      }
      static [import_entity52.entityKind] = "PgBigInt53";
      getSQLType() {
        return "bigint";
      }
      mapFromDriverValue(value) {
        if (typeof value === "number") {
          return value;
        }
        return Number(value);
      }
    };
    var PgBigInt64Builder = class extends import_int_common.PgIntColumnBaseBuilder {
      static {
        __name(this, "PgBigInt64Builder");
      }
      static [import_entity52.entityKind] = "PgBigInt64Builder";
      constructor(name) {
        super(name, "bigint", "PgBigInt64");
      }
      /** @internal */
      build(table) {
        return new PgBigInt64(
          table,
          this.config
        );
      }
    };
    var PgBigInt64 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgBigInt64");
      }
      static [import_entity52.entityKind] = "PgBigInt64";
      getSQLType() {
        return "bigint";
      }
      // eslint-disable-next-line unicorn/prefer-native-coercion-functions
      mapFromDriverValue(value) {
        return BigInt(value);
      }
    };
    function bigint(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (config.mode === "number") {
        return new PgBigInt53Builder(name);
      }
      return new PgBigInt64Builder(name);
    }
    __name(bigint, "bigint");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/bigserial.cjs
var require_bigserial = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/bigserial.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var bigserial_exports = {};
    __export2(bigserial_exports, {
      PgBigSerial53: /* @__PURE__ */ __name(() => PgBigSerial53, "PgBigSerial53"),
      PgBigSerial53Builder: /* @__PURE__ */ __name(() => PgBigSerial53Builder, "PgBigSerial53Builder"),
      PgBigSerial64: /* @__PURE__ */ __name(() => PgBigSerial64, "PgBigSerial64"),
      PgBigSerial64Builder: /* @__PURE__ */ __name(() => PgBigSerial64Builder, "PgBigSerial64Builder"),
      bigserial: /* @__PURE__ */ __name(() => bigserial, "bigserial")
    });
    module.exports = __toCommonJS2(bigserial_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgBigSerial53Builder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgBigSerial53Builder");
      }
      static [import_entity52.entityKind] = "PgBigSerial53Builder";
      constructor(name) {
        super(name, "number", "PgBigSerial53");
        this.config.hasDefault = true;
        this.config.notNull = true;
      }
      /** @internal */
      build(table) {
        return new PgBigSerial53(
          table,
          this.config
        );
      }
    };
    var PgBigSerial53 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgBigSerial53");
      }
      static [import_entity52.entityKind] = "PgBigSerial53";
      getSQLType() {
        return "bigserial";
      }
      mapFromDriverValue(value) {
        if (typeof value === "number") {
          return value;
        }
        return Number(value);
      }
    };
    var PgBigSerial64Builder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgBigSerial64Builder");
      }
      static [import_entity52.entityKind] = "PgBigSerial64Builder";
      constructor(name) {
        super(name, "bigint", "PgBigSerial64");
        this.config.hasDefault = true;
      }
      /** @internal */
      build(table) {
        return new PgBigSerial64(
          table,
          this.config
        );
      }
    };
    var PgBigSerial64 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgBigSerial64");
      }
      static [import_entity52.entityKind] = "PgBigSerial64";
      getSQLType() {
        return "bigserial";
      }
      // eslint-disable-next-line unicorn/prefer-native-coercion-functions
      mapFromDriverValue(value) {
        return BigInt(value);
      }
    };
    function bigserial(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (config.mode === "number") {
        return new PgBigSerial53Builder(name);
      }
      return new PgBigSerial64Builder(name);
    }
    __name(bigserial, "bigserial");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/boolean.cjs
var require_boolean = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/boolean.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var boolean_exports = {};
    __export2(boolean_exports, {
      PgBoolean: /* @__PURE__ */ __name(() => PgBoolean, "PgBoolean"),
      PgBooleanBuilder: /* @__PURE__ */ __name(() => PgBooleanBuilder, "PgBooleanBuilder"),
      boolean: /* @__PURE__ */ __name(() => boolean, "boolean")
    });
    module.exports = __toCommonJS2(boolean_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgBooleanBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgBooleanBuilder");
      }
      static [import_entity52.entityKind] = "PgBooleanBuilder";
      constructor(name) {
        super(name, "boolean", "PgBoolean");
      }
      /** @internal */
      build(table) {
        return new PgBoolean(table, this.config);
      }
    };
    var PgBoolean = class extends import_common9.PgColumn {
      static {
        __name(this, "PgBoolean");
      }
      static [import_entity52.entityKind] = "PgBoolean";
      getSQLType() {
        return "boolean";
      }
    };
    function boolean(name) {
      return new PgBooleanBuilder(name ?? "");
    }
    __name(boolean, "boolean");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/char.cjs
var require_char = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/char.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var char_exports = {};
    __export2(char_exports, {
      PgChar: /* @__PURE__ */ __name(() => PgChar, "PgChar"),
      PgCharBuilder: /* @__PURE__ */ __name(() => PgCharBuilder, "PgCharBuilder"),
      char: /* @__PURE__ */ __name(() => char, "char")
    });
    module.exports = __toCommonJS2(char_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgCharBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgCharBuilder");
      }
      static [import_entity52.entityKind] = "PgCharBuilder";
      constructor(name, config) {
        super(name, "string", "PgChar");
        this.config.length = config.length;
        this.config.enumValues = config.enum;
      }
      /** @internal */
      build(table) {
        return new PgChar(
          table,
          this.config
        );
      }
    };
    var PgChar = class extends import_common9.PgColumn {
      static {
        __name(this, "PgChar");
      }
      static [import_entity52.entityKind] = "PgChar";
      length = this.config.length;
      enumValues = this.config.enumValues;
      getSQLType() {
        return this.length === void 0 ? `char` : `char(${this.length})`;
      }
    };
    function char(a, b = {}) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgCharBuilder(name, config);
    }
    __name(char, "char");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/cidr.cjs
var require_cidr = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/cidr.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var cidr_exports = {};
    __export2(cidr_exports, {
      PgCidr: /* @__PURE__ */ __name(() => PgCidr, "PgCidr"),
      PgCidrBuilder: /* @__PURE__ */ __name(() => PgCidrBuilder, "PgCidrBuilder"),
      cidr: /* @__PURE__ */ __name(() => cidr, "cidr")
    });
    module.exports = __toCommonJS2(cidr_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgCidrBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgCidrBuilder");
      }
      static [import_entity52.entityKind] = "PgCidrBuilder";
      constructor(name) {
        super(name, "string", "PgCidr");
      }
      /** @internal */
      build(table) {
        return new PgCidr(table, this.config);
      }
    };
    var PgCidr = class extends import_common9.PgColumn {
      static {
        __name(this, "PgCidr");
      }
      static [import_entity52.entityKind] = "PgCidr";
      getSQLType() {
        return "cidr";
      }
    };
    function cidr(name) {
      return new PgCidrBuilder(name ?? "");
    }
    __name(cidr, "cidr");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/custom.cjs
var require_custom = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/custom.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var custom_exports = {};
    __export2(custom_exports, {
      PgCustomColumn: /* @__PURE__ */ __name(() => PgCustomColumn, "PgCustomColumn"),
      PgCustomColumnBuilder: /* @__PURE__ */ __name(() => PgCustomColumnBuilder, "PgCustomColumnBuilder"),
      customType: /* @__PURE__ */ __name(() => customType2, "customType")
    });
    module.exports = __toCommonJS2(custom_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgCustomColumnBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgCustomColumnBuilder");
      }
      static [import_entity52.entityKind] = "PgCustomColumnBuilder";
      constructor(name, fieldConfig, customTypeParams) {
        super(name, "custom", "PgCustomColumn");
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
      }
      /** @internal */
      build(table) {
        return new PgCustomColumn(
          table,
          this.config
        );
      }
    };
    var PgCustomColumn = class extends import_common9.PgColumn {
      static {
        __name(this, "PgCustomColumn");
      }
      static [import_entity52.entityKind] = "PgCustomColumn";
      sqlName;
      mapTo;
      mapFrom;
      constructor(table, config) {
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
      }
      getSQLType() {
        return this.sqlName;
      }
      mapFromDriverValue(value) {
        return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
      }
      mapToDriverValue(value) {
        return typeof this.mapTo === "function" ? this.mapTo(value) : value;
      }
    };
    function customType2(customTypeParams) {
      return (a, b) => {
        const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
        return new PgCustomColumnBuilder(name, config, customTypeParams);
      };
    }
    __name(customType2, "customType");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/date.common.cjs
var require_date_common = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/date.common.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var date_common_exports = {};
    __export2(date_common_exports, {
      PgDateColumnBaseBuilder: /* @__PURE__ */ __name(() => PgDateColumnBaseBuilder, "PgDateColumnBaseBuilder")
    });
    module.exports = __toCommonJS2(date_common_exports);
    var import_entity52 = require_entity();
    var import_sql17 = require_sql();
    var import_common9 = require_common();
    var PgDateColumnBaseBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgDateColumnBaseBuilder");
      }
      static [import_entity52.entityKind] = "PgDateColumnBaseBuilder";
      defaultNow() {
        return this.default(import_sql17.sql`now()`);
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/date.cjs
var require_date = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/date.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var date_exports = {};
    __export2(date_exports, {
      PgDate: /* @__PURE__ */ __name(() => PgDate, "PgDate"),
      PgDateBuilder: /* @__PURE__ */ __name(() => PgDateBuilder, "PgDateBuilder"),
      PgDateString: /* @__PURE__ */ __name(() => PgDateString, "PgDateString"),
      PgDateStringBuilder: /* @__PURE__ */ __name(() => PgDateStringBuilder, "PgDateStringBuilder"),
      date: /* @__PURE__ */ __name(() => date, "date")
    });
    module.exports = __toCommonJS2(date_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var import_date_common = require_date_common();
    var PgDateBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
      static {
        __name(this, "PgDateBuilder");
      }
      static [import_entity52.entityKind] = "PgDateBuilder";
      constructor(name) {
        super(name, "date", "PgDate");
      }
      /** @internal */
      build(table) {
        return new PgDate(table, this.config);
      }
    };
    var PgDate = class extends import_common9.PgColumn {
      static {
        __name(this, "PgDate");
      }
      static [import_entity52.entityKind] = "PgDate";
      getSQLType() {
        return "date";
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") return new Date(value);
        return value;
      }
      mapToDriverValue(value) {
        return value.toISOString();
      }
    };
    var PgDateStringBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
      static {
        __name(this, "PgDateStringBuilder");
      }
      static [import_entity52.entityKind] = "PgDateStringBuilder";
      constructor(name) {
        super(name, "string", "PgDateString");
      }
      /** @internal */
      build(table) {
        return new PgDateString(
          table,
          this.config
        );
      }
    };
    var PgDateString = class extends import_common9.PgColumn {
      static {
        __name(this, "PgDateString");
      }
      static [import_entity52.entityKind] = "PgDateString";
      getSQLType() {
        return "date";
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        return value.toISOString().slice(0, -14);
      }
    };
    function date(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (config?.mode === "date") {
        return new PgDateBuilder(name);
      }
      return new PgDateStringBuilder(name);
    }
    __name(date, "date");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/double-precision.cjs
var require_double_precision = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/double-precision.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var double_precision_exports = {};
    __export2(double_precision_exports, {
      PgDoublePrecision: /* @__PURE__ */ __name(() => PgDoublePrecision, "PgDoublePrecision"),
      PgDoublePrecisionBuilder: /* @__PURE__ */ __name(() => PgDoublePrecisionBuilder, "PgDoublePrecisionBuilder"),
      doublePrecision: /* @__PURE__ */ __name(() => doublePrecision, "doublePrecision")
    });
    module.exports = __toCommonJS2(double_precision_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgDoublePrecisionBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgDoublePrecisionBuilder");
      }
      static [import_entity52.entityKind] = "PgDoublePrecisionBuilder";
      constructor(name) {
        super(name, "number", "PgDoublePrecision");
      }
      /** @internal */
      build(table) {
        return new PgDoublePrecision(
          table,
          this.config
        );
      }
    };
    var PgDoublePrecision = class extends import_common9.PgColumn {
      static {
        __name(this, "PgDoublePrecision");
      }
      static [import_entity52.entityKind] = "PgDoublePrecision";
      getSQLType() {
        return "double precision";
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          return Number.parseFloat(value);
        }
        return value;
      }
    };
    function doublePrecision(name) {
      return new PgDoublePrecisionBuilder(name ?? "");
    }
    __name(doublePrecision, "doublePrecision");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/inet.cjs
var require_inet = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/inet.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var inet_exports = {};
    __export2(inet_exports, {
      PgInet: /* @__PURE__ */ __name(() => PgInet, "PgInet"),
      PgInetBuilder: /* @__PURE__ */ __name(() => PgInetBuilder, "PgInetBuilder"),
      inet: /* @__PURE__ */ __name(() => inet, "inet")
    });
    module.exports = __toCommonJS2(inet_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgInetBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgInetBuilder");
      }
      static [import_entity52.entityKind] = "PgInetBuilder";
      constructor(name) {
        super(name, "string", "PgInet");
      }
      /** @internal */
      build(table) {
        return new PgInet(table, this.config);
      }
    };
    var PgInet = class extends import_common9.PgColumn {
      static {
        __name(this, "PgInet");
      }
      static [import_entity52.entityKind] = "PgInet";
      getSQLType() {
        return "inet";
      }
    };
    function inet(name) {
      return new PgInetBuilder(name ?? "");
    }
    __name(inet, "inet");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/integer.cjs
var require_integer = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/integer.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var integer_exports = {};
    __export2(integer_exports, {
      PgInteger: /* @__PURE__ */ __name(() => PgInteger, "PgInteger"),
      PgIntegerBuilder: /* @__PURE__ */ __name(() => PgIntegerBuilder, "PgIntegerBuilder"),
      integer: /* @__PURE__ */ __name(() => integer2, "integer")
    });
    module.exports = __toCommonJS2(integer_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var import_int_common = require_int_common();
    var PgIntegerBuilder = class extends import_int_common.PgIntColumnBaseBuilder {
      static {
        __name(this, "PgIntegerBuilder");
      }
      static [import_entity52.entityKind] = "PgIntegerBuilder";
      constructor(name) {
        super(name, "number", "PgInteger");
      }
      /** @internal */
      build(table) {
        return new PgInteger(table, this.config);
      }
    };
    var PgInteger = class extends import_common9.PgColumn {
      static {
        __name(this, "PgInteger");
      }
      static [import_entity52.entityKind] = "PgInteger";
      getSQLType() {
        return "integer";
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          return Number.parseInt(value);
        }
        return value;
      }
    };
    function integer2(name) {
      return new PgIntegerBuilder(name ?? "");
    }
    __name(integer2, "integer");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/interval.cjs
var require_interval = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/interval.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var interval_exports = {};
    __export2(interval_exports, {
      PgInterval: /* @__PURE__ */ __name(() => PgInterval, "PgInterval"),
      PgIntervalBuilder: /* @__PURE__ */ __name(() => PgIntervalBuilder, "PgIntervalBuilder"),
      interval: /* @__PURE__ */ __name(() => interval, "interval")
    });
    module.exports = __toCommonJS2(interval_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgIntervalBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgIntervalBuilder");
      }
      static [import_entity52.entityKind] = "PgIntervalBuilder";
      constructor(name, intervalConfig) {
        super(name, "string", "PgInterval");
        this.config.intervalConfig = intervalConfig;
      }
      /** @internal */
      build(table) {
        return new PgInterval(table, this.config);
      }
    };
    var PgInterval = class extends import_common9.PgColumn {
      static {
        __name(this, "PgInterval");
      }
      static [import_entity52.entityKind] = "PgInterval";
      fields = this.config.intervalConfig.fields;
      precision = this.config.intervalConfig.precision;
      getSQLType() {
        const fields = this.fields ? ` ${this.fields}` : "";
        const precision = this.precision ? `(${this.precision})` : "";
        return `interval${fields}${precision}`;
      }
    };
    function interval(a, b = {}) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgIntervalBuilder(name, config);
    }
    __name(interval, "interval");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/json.cjs
var require_json = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/json.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var json_exports = {};
    __export2(json_exports, {
      PgJson: /* @__PURE__ */ __name(() => PgJson, "PgJson"),
      PgJsonBuilder: /* @__PURE__ */ __name(() => PgJsonBuilder, "PgJsonBuilder"),
      json: /* @__PURE__ */ __name(() => json, "json")
    });
    module.exports = __toCommonJS2(json_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgJsonBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgJsonBuilder");
      }
      static [import_entity52.entityKind] = "PgJsonBuilder";
      constructor(name) {
        super(name, "json", "PgJson");
      }
      /** @internal */
      build(table) {
        return new PgJson(table, this.config);
      }
    };
    var PgJson = class extends import_common9.PgColumn {
      static {
        __name(this, "PgJson");
      }
      static [import_entity52.entityKind] = "PgJson";
      constructor(table, config) {
        super(table, config);
      }
      getSQLType() {
        return "json";
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value;
      }
    };
    function json(name) {
      return new PgJsonBuilder(name ?? "");
    }
    __name(json, "json");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/jsonb.cjs
var require_jsonb = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/jsonb.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var jsonb_exports = {};
    __export2(jsonb_exports, {
      PgJsonb: /* @__PURE__ */ __name(() => PgJsonb, "PgJsonb"),
      PgJsonbBuilder: /* @__PURE__ */ __name(() => PgJsonbBuilder, "PgJsonbBuilder"),
      jsonb: /* @__PURE__ */ __name(() => jsonb, "jsonb")
    });
    module.exports = __toCommonJS2(jsonb_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgJsonbBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgJsonbBuilder");
      }
      static [import_entity52.entityKind] = "PgJsonbBuilder";
      constructor(name) {
        super(name, "json", "PgJsonb");
      }
      /** @internal */
      build(table) {
        return new PgJsonb(table, this.config);
      }
    };
    var PgJsonb = class extends import_common9.PgColumn {
      static {
        __name(this, "PgJsonb");
      }
      static [import_entity52.entityKind] = "PgJsonb";
      constructor(table, config) {
        super(table, config);
      }
      getSQLType() {
        return "jsonb";
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value;
      }
    };
    function jsonb(name) {
      return new PgJsonbBuilder(name ?? "");
    }
    __name(jsonb, "jsonb");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/line.cjs
var require_line = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/line.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var line_exports = {};
    __export2(line_exports, {
      PgLineABC: /* @__PURE__ */ __name(() => PgLineABC, "PgLineABC"),
      PgLineABCBuilder: /* @__PURE__ */ __name(() => PgLineABCBuilder, "PgLineABCBuilder"),
      PgLineBuilder: /* @__PURE__ */ __name(() => PgLineBuilder, "PgLineBuilder"),
      PgLineTuple: /* @__PURE__ */ __name(() => PgLineTuple, "PgLineTuple"),
      line: /* @__PURE__ */ __name(() => line, "line")
    });
    module.exports = __toCommonJS2(line_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgLineBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgLineBuilder");
      }
      static [import_entity52.entityKind] = "PgLineBuilder";
      constructor(name) {
        super(name, "array", "PgLine");
      }
      /** @internal */
      build(table) {
        return new PgLineTuple(
          table,
          this.config
        );
      }
    };
    var PgLineTuple = class extends import_common9.PgColumn {
      static {
        __name(this, "PgLineTuple");
      }
      static [import_entity52.entityKind] = "PgLine";
      getSQLType() {
        return "line";
      }
      mapFromDriverValue(value) {
        const [a, b, c] = value.slice(1, -1).split(",");
        return [Number.parseFloat(a), Number.parseFloat(b), Number.parseFloat(c)];
      }
      mapToDriverValue(value) {
        return `{${value[0]},${value[1]},${value[2]}}`;
      }
    };
    var PgLineABCBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgLineABCBuilder");
      }
      static [import_entity52.entityKind] = "PgLineABCBuilder";
      constructor(name) {
        super(name, "json", "PgLineABC");
      }
      /** @internal */
      build(table) {
        return new PgLineABC(
          table,
          this.config
        );
      }
    };
    var PgLineABC = class extends import_common9.PgColumn {
      static {
        __name(this, "PgLineABC");
      }
      static [import_entity52.entityKind] = "PgLineABC";
      getSQLType() {
        return "line";
      }
      mapFromDriverValue(value) {
        const [a, b, c] = value.slice(1, -1).split(",");
        return { a: Number.parseFloat(a), b: Number.parseFloat(b), c: Number.parseFloat(c) };
      }
      mapToDriverValue(value) {
        return `{${value.a},${value.b},${value.c}}`;
      }
    };
    function line(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (!config?.mode || config.mode === "tuple") {
        return new PgLineBuilder(name);
      }
      return new PgLineABCBuilder(name);
    }
    __name(line, "line");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/macaddr.cjs
var require_macaddr = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/macaddr.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var macaddr_exports = {};
    __export2(macaddr_exports, {
      PgMacaddr: /* @__PURE__ */ __name(() => PgMacaddr, "PgMacaddr"),
      PgMacaddrBuilder: /* @__PURE__ */ __name(() => PgMacaddrBuilder, "PgMacaddrBuilder"),
      macaddr: /* @__PURE__ */ __name(() => macaddr, "macaddr")
    });
    module.exports = __toCommonJS2(macaddr_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgMacaddrBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgMacaddrBuilder");
      }
      static [import_entity52.entityKind] = "PgMacaddrBuilder";
      constructor(name) {
        super(name, "string", "PgMacaddr");
      }
      /** @internal */
      build(table) {
        return new PgMacaddr(table, this.config);
      }
    };
    var PgMacaddr = class extends import_common9.PgColumn {
      static {
        __name(this, "PgMacaddr");
      }
      static [import_entity52.entityKind] = "PgMacaddr";
      getSQLType() {
        return "macaddr";
      }
    };
    function macaddr(name) {
      return new PgMacaddrBuilder(name ?? "");
    }
    __name(macaddr, "macaddr");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/macaddr8.cjs
var require_macaddr8 = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/macaddr8.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var macaddr8_exports = {};
    __export2(macaddr8_exports, {
      PgMacaddr8: /* @__PURE__ */ __name(() => PgMacaddr8, "PgMacaddr8"),
      PgMacaddr8Builder: /* @__PURE__ */ __name(() => PgMacaddr8Builder, "PgMacaddr8Builder"),
      macaddr8: /* @__PURE__ */ __name(() => macaddr8, "macaddr8")
    });
    module.exports = __toCommonJS2(macaddr8_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgMacaddr8Builder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgMacaddr8Builder");
      }
      static [import_entity52.entityKind] = "PgMacaddr8Builder";
      constructor(name) {
        super(name, "string", "PgMacaddr8");
      }
      /** @internal */
      build(table) {
        return new PgMacaddr8(table, this.config);
      }
    };
    var PgMacaddr8 = class extends import_common9.PgColumn {
      static {
        __name(this, "PgMacaddr8");
      }
      static [import_entity52.entityKind] = "PgMacaddr8";
      getSQLType() {
        return "macaddr8";
      }
    };
    function macaddr8(name) {
      return new PgMacaddr8Builder(name ?? "");
    }
    __name(macaddr8, "macaddr8");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/numeric.cjs
var require_numeric = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/numeric.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var numeric_exports = {};
    __export2(numeric_exports, {
      PgNumeric: /* @__PURE__ */ __name(() => PgNumeric, "PgNumeric"),
      PgNumericBigInt: /* @__PURE__ */ __name(() => PgNumericBigInt, "PgNumericBigInt"),
      PgNumericBigIntBuilder: /* @__PURE__ */ __name(() => PgNumericBigIntBuilder, "PgNumericBigIntBuilder"),
      PgNumericBuilder: /* @__PURE__ */ __name(() => PgNumericBuilder, "PgNumericBuilder"),
      PgNumericNumber: /* @__PURE__ */ __name(() => PgNumericNumber, "PgNumericNumber"),
      PgNumericNumberBuilder: /* @__PURE__ */ __name(() => PgNumericNumberBuilder, "PgNumericNumberBuilder"),
      decimal: /* @__PURE__ */ __name(() => decimal, "decimal"),
      numeric: /* @__PURE__ */ __name(() => numeric2, "numeric")
    });
    module.exports = __toCommonJS2(numeric_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgNumericBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgNumericBuilder");
      }
      static [import_entity52.entityKind] = "PgNumericBuilder";
      constructor(name, precision, scale) {
        super(name, "string", "PgNumeric");
        this.config.precision = precision;
        this.config.scale = scale;
      }
      /** @internal */
      build(table) {
        return new PgNumeric(table, this.config);
      }
    };
    var PgNumeric = class extends import_common9.PgColumn {
      static {
        __name(this, "PgNumeric");
      }
      static [import_entity52.entityKind] = "PgNumeric";
      precision;
      scale;
      constructor(table, config) {
        super(table, config);
        this.precision = config.precision;
        this.scale = config.scale;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        return String(value);
      }
      getSQLType() {
        if (this.precision !== void 0 && this.scale !== void 0) {
          return `numeric(${this.precision}, ${this.scale})`;
        } else if (this.precision === void 0) {
          return "numeric";
        } else {
          return `numeric(${this.precision})`;
        }
      }
    };
    var PgNumericNumberBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgNumericNumberBuilder");
      }
      static [import_entity52.entityKind] = "PgNumericNumberBuilder";
      constructor(name, precision, scale) {
        super(name, "number", "PgNumericNumber");
        this.config.precision = precision;
        this.config.scale = scale;
      }
      /** @internal */
      build(table) {
        return new PgNumericNumber(
          table,
          this.config
        );
      }
    };
    var PgNumericNumber = class extends import_common9.PgColumn {
      static {
        __name(this, "PgNumericNumber");
      }
      static [import_entity52.entityKind] = "PgNumericNumber";
      precision;
      scale;
      constructor(table, config) {
        super(table, config);
        this.precision = config.precision;
        this.scale = config.scale;
      }
      mapFromDriverValue(value) {
        if (typeof value === "number") return value;
        return Number(value);
      }
      mapToDriverValue = String;
      getSQLType() {
        if (this.precision !== void 0 && this.scale !== void 0) {
          return `numeric(${this.precision}, ${this.scale})`;
        } else if (this.precision === void 0) {
          return "numeric";
        } else {
          return `numeric(${this.precision})`;
        }
      }
    };
    var PgNumericBigIntBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgNumericBigIntBuilder");
      }
      static [import_entity52.entityKind] = "PgNumericBigIntBuilder";
      constructor(name, precision, scale) {
        super(name, "bigint", "PgNumericBigInt");
        this.config.precision = precision;
        this.config.scale = scale;
      }
      /** @internal */
      build(table) {
        return new PgNumericBigInt(
          table,
          this.config
        );
      }
    };
    var PgNumericBigInt = class extends import_common9.PgColumn {
      static {
        __name(this, "PgNumericBigInt");
      }
      static [import_entity52.entityKind] = "PgNumericBigInt";
      precision;
      scale;
      constructor(table, config) {
        super(table, config);
        this.precision = config.precision;
        this.scale = config.scale;
      }
      mapFromDriverValue = BigInt;
      mapToDriverValue = String;
      getSQLType() {
        if (this.precision !== void 0 && this.scale !== void 0) {
          return `numeric(${this.precision}, ${this.scale})`;
        } else if (this.precision === void 0) {
          return "numeric";
        } else {
          return `numeric(${this.precision})`;
        }
      }
    };
    function numeric2(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      const mode = config?.mode;
      return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
    }
    __name(numeric2, "numeric");
    var decimal = numeric2;
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/point.cjs
var require_point = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/point.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var point_exports = {};
    __export2(point_exports, {
      PgPointObject: /* @__PURE__ */ __name(() => PgPointObject, "PgPointObject"),
      PgPointObjectBuilder: /* @__PURE__ */ __name(() => PgPointObjectBuilder, "PgPointObjectBuilder"),
      PgPointTuple: /* @__PURE__ */ __name(() => PgPointTuple, "PgPointTuple"),
      PgPointTupleBuilder: /* @__PURE__ */ __name(() => PgPointTupleBuilder, "PgPointTupleBuilder"),
      point: /* @__PURE__ */ __name(() => point, "point")
    });
    module.exports = __toCommonJS2(point_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgPointTupleBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgPointTupleBuilder");
      }
      static [import_entity52.entityKind] = "PgPointTupleBuilder";
      constructor(name) {
        super(name, "array", "PgPointTuple");
      }
      /** @internal */
      build(table) {
        return new PgPointTuple(
          table,
          this.config
        );
      }
    };
    var PgPointTuple = class extends import_common9.PgColumn {
      static {
        __name(this, "PgPointTuple");
      }
      static [import_entity52.entityKind] = "PgPointTuple";
      getSQLType() {
        return "point";
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          const [x, y] = value.slice(1, -1).split(",");
          return [Number.parseFloat(x), Number.parseFloat(y)];
        }
        return [value.x, value.y];
      }
      mapToDriverValue(value) {
        return `(${value[0]},${value[1]})`;
      }
    };
    var PgPointObjectBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgPointObjectBuilder");
      }
      static [import_entity52.entityKind] = "PgPointObjectBuilder";
      constructor(name) {
        super(name, "json", "PgPointObject");
      }
      /** @internal */
      build(table) {
        return new PgPointObject(
          table,
          this.config
        );
      }
    };
    var PgPointObject = class extends import_common9.PgColumn {
      static {
        __name(this, "PgPointObject");
      }
      static [import_entity52.entityKind] = "PgPointObject";
      getSQLType() {
        return "point";
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          const [x, y] = value.slice(1, -1).split(",");
          return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
        }
        return value;
      }
      mapToDriverValue(value) {
        return `(${value.x},${value.y})`;
      }
    };
    function point(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (!config?.mode || config.mode === "tuple") {
        return new PgPointTupleBuilder(name);
      }
      return new PgPointObjectBuilder(name);
    }
    __name(point, "point");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.cjs
var require_utils2 = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var utils_exports = {};
    __export2(utils_exports, {
      parseEWKB: /* @__PURE__ */ __name(() => parseEWKB, "parseEWKB")
    });
    module.exports = __toCommonJS2(utils_exports);
    function hexToBytes(hex) {
      const bytes = [];
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
      }
      return new Uint8Array(bytes);
    }
    __name(hexToBytes, "hexToBytes");
    function bytesToFloat64(bytes, offset) {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      for (let i = 0; i < 8; i++) {
        view.setUint8(i, bytes[offset + i]);
      }
      return view.getFloat64(0, true);
    }
    __name(bytesToFloat64, "bytesToFloat64");
    function parseEWKB(hex) {
      const bytes = hexToBytes(hex);
      let offset = 0;
      const byteOrder = bytes[offset];
      offset += 1;
      const view = new DataView(bytes.buffer);
      const geomType = view.getUint32(offset, byteOrder === 1);
      offset += 4;
      let _srid;
      if (geomType & 536870912) {
        _srid = view.getUint32(offset, byteOrder === 1);
        offset += 4;
      }
      if ((geomType & 65535) === 1) {
        const x = bytesToFloat64(bytes, offset);
        offset += 8;
        const y = bytesToFloat64(bytes, offset);
        offset += 8;
        return [x, y];
      }
      throw new Error("Unsupported geometry type");
    }
    __name(parseEWKB, "parseEWKB");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.cjs
var require_geometry = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var geometry_exports = {};
    __export2(geometry_exports, {
      PgGeometry: /* @__PURE__ */ __name(() => PgGeometry, "PgGeometry"),
      PgGeometryBuilder: /* @__PURE__ */ __name(() => PgGeometryBuilder, "PgGeometryBuilder"),
      PgGeometryObject: /* @__PURE__ */ __name(() => PgGeometryObject, "PgGeometryObject"),
      PgGeometryObjectBuilder: /* @__PURE__ */ __name(() => PgGeometryObjectBuilder, "PgGeometryObjectBuilder"),
      geometry: /* @__PURE__ */ __name(() => geometry, "geometry")
    });
    module.exports = __toCommonJS2(geometry_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var import_utils22 = require_utils2();
    var PgGeometryBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgGeometryBuilder");
      }
      static [import_entity52.entityKind] = "PgGeometryBuilder";
      constructor(name) {
        super(name, "array", "PgGeometry");
      }
      /** @internal */
      build(table) {
        return new PgGeometry(
          table,
          this.config
        );
      }
    };
    var PgGeometry = class extends import_common9.PgColumn {
      static {
        __name(this, "PgGeometry");
      }
      static [import_entity52.entityKind] = "PgGeometry";
      getSQLType() {
        return "geometry(point)";
      }
      mapFromDriverValue(value) {
        return (0, import_utils22.parseEWKB)(value);
      }
      mapToDriverValue(value) {
        return `point(${value[0]} ${value[1]})`;
      }
    };
    var PgGeometryObjectBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgGeometryObjectBuilder");
      }
      static [import_entity52.entityKind] = "PgGeometryObjectBuilder";
      constructor(name) {
        super(name, "json", "PgGeometryObject");
      }
      /** @internal */
      build(table) {
        return new PgGeometryObject(
          table,
          this.config
        );
      }
    };
    var PgGeometryObject = class extends import_common9.PgColumn {
      static {
        __name(this, "PgGeometryObject");
      }
      static [import_entity52.entityKind] = "PgGeometryObject";
      getSQLType() {
        return "geometry(point)";
      }
      mapFromDriverValue(value) {
        const parsed = (0, import_utils22.parseEWKB)(value);
        return { x: parsed[0], y: parsed[1] };
      }
      mapToDriverValue(value) {
        return `point(${value.x} ${value.y})`;
      }
    };
    function geometry(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (!config?.mode || config.mode === "tuple") {
        return new PgGeometryBuilder(name);
      }
      return new PgGeometryObjectBuilder(name);
    }
    __name(geometry, "geometry");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/real.cjs
var require_real = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/real.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var real_exports = {};
    __export2(real_exports, {
      PgReal: /* @__PURE__ */ __name(() => PgReal, "PgReal"),
      PgRealBuilder: /* @__PURE__ */ __name(() => PgRealBuilder, "PgRealBuilder"),
      real: /* @__PURE__ */ __name(() => real2, "real")
    });
    module.exports = __toCommonJS2(real_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgRealBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgRealBuilder");
      }
      static [import_entity52.entityKind] = "PgRealBuilder";
      constructor(name, length) {
        super(name, "number", "PgReal");
        this.config.length = length;
      }
      /** @internal */
      build(table) {
        return new PgReal(table, this.config);
      }
    };
    var PgReal = class extends import_common9.PgColumn {
      static {
        __name(this, "PgReal");
      }
      static [import_entity52.entityKind] = "PgReal";
      constructor(table, config) {
        super(table, config);
      }
      getSQLType() {
        return "real";
      }
      mapFromDriverValue = /* @__PURE__ */ __name((value) => {
        if (typeof value === "string") {
          return Number.parseFloat(value);
        }
        return value;
      }, "mapFromDriverValue");
    };
    function real2(name) {
      return new PgRealBuilder(name ?? "");
    }
    __name(real2, "real");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/serial.cjs
var require_serial = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/serial.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var serial_exports = {};
    __export2(serial_exports, {
      PgSerial: /* @__PURE__ */ __name(() => PgSerial, "PgSerial"),
      PgSerialBuilder: /* @__PURE__ */ __name(() => PgSerialBuilder, "PgSerialBuilder"),
      serial: /* @__PURE__ */ __name(() => serial, "serial")
    });
    module.exports = __toCommonJS2(serial_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgSerialBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgSerialBuilder");
      }
      static [import_entity52.entityKind] = "PgSerialBuilder";
      constructor(name) {
        super(name, "number", "PgSerial");
        this.config.hasDefault = true;
        this.config.notNull = true;
      }
      /** @internal */
      build(table) {
        return new PgSerial(table, this.config);
      }
    };
    var PgSerial = class extends import_common9.PgColumn {
      static {
        __name(this, "PgSerial");
      }
      static [import_entity52.entityKind] = "PgSerial";
      getSQLType() {
        return "serial";
      }
    };
    function serial(name) {
      return new PgSerialBuilder(name ?? "");
    }
    __name(serial, "serial");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/smallint.cjs
var require_smallint = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/smallint.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var smallint_exports = {};
    __export2(smallint_exports, {
      PgSmallInt: /* @__PURE__ */ __name(() => PgSmallInt, "PgSmallInt"),
      PgSmallIntBuilder: /* @__PURE__ */ __name(() => PgSmallIntBuilder, "PgSmallIntBuilder"),
      smallint: /* @__PURE__ */ __name(() => smallint, "smallint")
    });
    module.exports = __toCommonJS2(smallint_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var import_int_common = require_int_common();
    var PgSmallIntBuilder = class extends import_int_common.PgIntColumnBaseBuilder {
      static {
        __name(this, "PgSmallIntBuilder");
      }
      static [import_entity52.entityKind] = "PgSmallIntBuilder";
      constructor(name) {
        super(name, "number", "PgSmallInt");
      }
      /** @internal */
      build(table) {
        return new PgSmallInt(table, this.config);
      }
    };
    var PgSmallInt = class extends import_common9.PgColumn {
      static {
        __name(this, "PgSmallInt");
      }
      static [import_entity52.entityKind] = "PgSmallInt";
      getSQLType() {
        return "smallint";
      }
      mapFromDriverValue = /* @__PURE__ */ __name((value) => {
        if (typeof value === "string") {
          return Number(value);
        }
        return value;
      }, "mapFromDriverValue");
    };
    function smallint(name) {
      return new PgSmallIntBuilder(name ?? "");
    }
    __name(smallint, "smallint");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/smallserial.cjs
var require_smallserial = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/smallserial.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var smallserial_exports = {};
    __export2(smallserial_exports, {
      PgSmallSerial: /* @__PURE__ */ __name(() => PgSmallSerial, "PgSmallSerial"),
      PgSmallSerialBuilder: /* @__PURE__ */ __name(() => PgSmallSerialBuilder, "PgSmallSerialBuilder"),
      smallserial: /* @__PURE__ */ __name(() => smallserial, "smallserial")
    });
    module.exports = __toCommonJS2(smallserial_exports);
    var import_entity52 = require_entity();
    var import_common9 = require_common();
    var PgSmallSerialBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgSmallSerialBuilder");
      }
      static [import_entity52.entityKind] = "PgSmallSerialBuilder";
      constructor(name) {
        super(name, "number", "PgSmallSerial");
        this.config.hasDefault = true;
        this.config.notNull = true;
      }
      /** @internal */
      build(table) {
        return new PgSmallSerial(
          table,
          this.config
        );
      }
    };
    var PgSmallSerial = class extends import_common9.PgColumn {
      static {
        __name(this, "PgSmallSerial");
      }
      static [import_entity52.entityKind] = "PgSmallSerial";
      getSQLType() {
        return "smallserial";
      }
    };
    function smallserial(name) {
      return new PgSmallSerialBuilder(name ?? "");
    }
    __name(smallserial, "smallserial");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/text.cjs
var require_text = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/text.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var text_exports = {};
    __export2(text_exports, {
      PgText: /* @__PURE__ */ __name(() => PgText, "PgText"),
      PgTextBuilder: /* @__PURE__ */ __name(() => PgTextBuilder, "PgTextBuilder"),
      text: /* @__PURE__ */ __name(() => text2, "text")
    });
    module.exports = __toCommonJS2(text_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgTextBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgTextBuilder");
      }
      static [import_entity52.entityKind] = "PgTextBuilder";
      constructor(name, config) {
        super(name, "string", "PgText");
        this.config.enumValues = config.enum;
      }
      /** @internal */
      build(table) {
        return new PgText(table, this.config);
      }
    };
    var PgText = class extends import_common9.PgColumn {
      static {
        __name(this, "PgText");
      }
      static [import_entity52.entityKind] = "PgText";
      enumValues = this.config.enumValues;
      getSQLType() {
        return "text";
      }
    };
    function text2(a, b = {}) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgTextBuilder(name, config);
    }
    __name(text2, "text");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/time.cjs
var require_time = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/time.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var time_exports = {};
    __export2(time_exports, {
      PgTime: /* @__PURE__ */ __name(() => PgTime, "PgTime"),
      PgTimeBuilder: /* @__PURE__ */ __name(() => PgTimeBuilder, "PgTimeBuilder"),
      time: /* @__PURE__ */ __name(() => time, "time")
    });
    module.exports = __toCommonJS2(time_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var import_date_common = require_date_common();
    var PgTimeBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
      static {
        __name(this, "PgTimeBuilder");
      }
      constructor(name, withTimezone, precision) {
        super(name, "string", "PgTime");
        this.withTimezone = withTimezone;
        this.precision = precision;
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
      }
      static [import_entity52.entityKind] = "PgTimeBuilder";
      /** @internal */
      build(table) {
        return new PgTime(table, this.config);
      }
    };
    var PgTime = class extends import_common9.PgColumn {
      static {
        __name(this, "PgTime");
      }
      static [import_entity52.entityKind] = "PgTime";
      withTimezone;
      precision;
      constructor(table, config) {
        super(table, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
      }
      getSQLType() {
        const precision = this.precision === void 0 ? "" : `(${this.precision})`;
        return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
      }
    };
    function time(a, b = {}) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
    }
    __name(time, "time");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/timestamp.cjs
var require_timestamp = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/timestamp.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var timestamp_exports = {};
    __export2(timestamp_exports, {
      PgTimestamp: /* @__PURE__ */ __name(() => PgTimestamp, "PgTimestamp"),
      PgTimestampBuilder: /* @__PURE__ */ __name(() => PgTimestampBuilder, "PgTimestampBuilder"),
      PgTimestampString: /* @__PURE__ */ __name(() => PgTimestampString, "PgTimestampString"),
      PgTimestampStringBuilder: /* @__PURE__ */ __name(() => PgTimestampStringBuilder, "PgTimestampStringBuilder"),
      timestamp: /* @__PURE__ */ __name(() => timestamp, "timestamp")
    });
    module.exports = __toCommonJS2(timestamp_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var import_date_common = require_date_common();
    var PgTimestampBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
      static {
        __name(this, "PgTimestampBuilder");
      }
      static [import_entity52.entityKind] = "PgTimestampBuilder";
      constructor(name, withTimezone, precision) {
        super(name, "date", "PgTimestamp");
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
      }
      /** @internal */
      build(table) {
        return new PgTimestamp(table, this.config);
      }
    };
    var PgTimestamp = class extends import_common9.PgColumn {
      static {
        __name(this, "PgTimestamp");
      }
      static [import_entity52.entityKind] = "PgTimestamp";
      withTimezone;
      precision;
      constructor(table, config) {
        super(table, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
      }
      getSQLType() {
        const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
        return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") return new Date(this.withTimezone ? value : value + "+0000");
        return value;
      }
      mapToDriverValue = /* @__PURE__ */ __name((value) => {
        return value.toISOString();
      }, "mapToDriverValue");
    };
    var PgTimestampStringBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
      static {
        __name(this, "PgTimestampStringBuilder");
      }
      static [import_entity52.entityKind] = "PgTimestampStringBuilder";
      constructor(name, withTimezone, precision) {
        super(name, "string", "PgTimestampString");
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
      }
      /** @internal */
      build(table) {
        return new PgTimestampString(
          table,
          this.config
        );
      }
    };
    var PgTimestampString = class extends import_common9.PgColumn {
      static {
        __name(this, "PgTimestampString");
      }
      static [import_entity52.entityKind] = "PgTimestampString";
      withTimezone;
      precision;
      constructor(table, config) {
        super(table, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
      }
      getSQLType() {
        const precision = this.precision === void 0 ? "" : `(${this.precision})`;
        return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        const shortened = value.toISOString().slice(0, -1).replace("T", " ");
        if (this.withTimezone) {
          const offset = value.getTimezoneOffset();
          const sign3 = offset <= 0 ? "+" : "-";
          return `${shortened}${sign3}${Math.floor(Math.abs(offset) / 60).toString().padStart(2, "0")}`;
        }
        return shortened;
      }
    };
    function timestamp(a, b = {}) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      if (config?.mode === "string") {
        return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
      }
      return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
    }
    __name(timestamp, "timestamp");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/uuid.cjs
var require_uuid = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/uuid.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var uuid_exports = {};
    __export2(uuid_exports, {
      PgUUID: /* @__PURE__ */ __name(() => PgUUID, "PgUUID"),
      PgUUIDBuilder: /* @__PURE__ */ __name(() => PgUUIDBuilder, "PgUUIDBuilder"),
      uuid: /* @__PURE__ */ __name(() => uuid, "uuid")
    });
    module.exports = __toCommonJS2(uuid_exports);
    var import_entity52 = require_entity();
    var import_sql17 = require_sql();
    var import_common9 = require_common();
    var PgUUIDBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgUUIDBuilder");
      }
      static [import_entity52.entityKind] = "PgUUIDBuilder";
      constructor(name) {
        super(name, "string", "PgUUID");
      }
      /**
       * Adds `default gen_random_uuid()` to the column definition.
       */
      defaultRandom() {
        return this.default(import_sql17.sql`gen_random_uuid()`);
      }
      /** @internal */
      build(table) {
        return new PgUUID(table, this.config);
      }
    };
    var PgUUID = class extends import_common9.PgColumn {
      static {
        __name(this, "PgUUID");
      }
      static [import_entity52.entityKind] = "PgUUID";
      getSQLType() {
        return "uuid";
      }
    };
    function uuid(name) {
      return new PgUUIDBuilder(name ?? "");
    }
    __name(uuid, "uuid");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/varchar.cjs
var require_varchar = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/varchar.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var varchar_exports = {};
    __export2(varchar_exports, {
      PgVarchar: /* @__PURE__ */ __name(() => PgVarchar, "PgVarchar"),
      PgVarcharBuilder: /* @__PURE__ */ __name(() => PgVarcharBuilder, "PgVarcharBuilder"),
      varchar: /* @__PURE__ */ __name(() => varchar, "varchar")
    });
    module.exports = __toCommonJS2(varchar_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgVarcharBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgVarcharBuilder");
      }
      static [import_entity52.entityKind] = "PgVarcharBuilder";
      constructor(name, config) {
        super(name, "string", "PgVarchar");
        this.config.length = config.length;
        this.config.enumValues = config.enum;
      }
      /** @internal */
      build(table) {
        return new PgVarchar(
          table,
          this.config
        );
      }
    };
    var PgVarchar = class extends import_common9.PgColumn {
      static {
        __name(this, "PgVarchar");
      }
      static [import_entity52.entityKind] = "PgVarchar";
      length = this.config.length;
      enumValues = this.config.enumValues;
      getSQLType() {
        return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
      }
    };
    function varchar(a, b = {}) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgVarcharBuilder(name, config);
    }
    __name(varchar, "varchar");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.cjs
var require_bit = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var bit_exports = {};
    __export2(bit_exports, {
      PgBinaryVector: /* @__PURE__ */ __name(() => PgBinaryVector, "PgBinaryVector"),
      PgBinaryVectorBuilder: /* @__PURE__ */ __name(() => PgBinaryVectorBuilder, "PgBinaryVectorBuilder"),
      bit: /* @__PURE__ */ __name(() => bit, "bit")
    });
    module.exports = __toCommonJS2(bit_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgBinaryVectorBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgBinaryVectorBuilder");
      }
      static [import_entity52.entityKind] = "PgBinaryVectorBuilder";
      constructor(name, config) {
        super(name, "string", "PgBinaryVector");
        this.config.dimensions = config.dimensions;
      }
      /** @internal */
      build(table) {
        return new PgBinaryVector(
          table,
          this.config
        );
      }
    };
    var PgBinaryVector = class extends import_common9.PgColumn {
      static {
        __name(this, "PgBinaryVector");
      }
      static [import_entity52.entityKind] = "PgBinaryVector";
      dimensions = this.config.dimensions;
      getSQLType() {
        return `bit(${this.dimensions})`;
      }
    };
    function bit(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgBinaryVectorBuilder(name, config);
    }
    __name(bit, "bit");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.cjs
var require_halfvec = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var halfvec_exports = {};
    __export2(halfvec_exports, {
      PgHalfVector: /* @__PURE__ */ __name(() => PgHalfVector, "PgHalfVector"),
      PgHalfVectorBuilder: /* @__PURE__ */ __name(() => PgHalfVectorBuilder, "PgHalfVectorBuilder"),
      halfvec: /* @__PURE__ */ __name(() => halfvec, "halfvec")
    });
    module.exports = __toCommonJS2(halfvec_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgHalfVectorBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgHalfVectorBuilder");
      }
      static [import_entity52.entityKind] = "PgHalfVectorBuilder";
      constructor(name, config) {
        super(name, "array", "PgHalfVector");
        this.config.dimensions = config.dimensions;
      }
      /** @internal */
      build(table) {
        return new PgHalfVector(
          table,
          this.config
        );
      }
    };
    var PgHalfVector = class extends import_common9.PgColumn {
      static {
        __name(this, "PgHalfVector");
      }
      static [import_entity52.entityKind] = "PgHalfVector";
      dimensions = this.config.dimensions;
      getSQLType() {
        return `halfvec(${this.dimensions})`;
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
      mapFromDriverValue(value) {
        return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
      }
    };
    function halfvec(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgHalfVectorBuilder(name, config);
    }
    __name(halfvec, "halfvec");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.cjs
var require_sparsevec = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var sparsevec_exports = {};
    __export2(sparsevec_exports, {
      PgSparseVector: /* @__PURE__ */ __name(() => PgSparseVector, "PgSparseVector"),
      PgSparseVectorBuilder: /* @__PURE__ */ __name(() => PgSparseVectorBuilder, "PgSparseVectorBuilder"),
      sparsevec: /* @__PURE__ */ __name(() => sparsevec, "sparsevec")
    });
    module.exports = __toCommonJS2(sparsevec_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgSparseVectorBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgSparseVectorBuilder");
      }
      static [import_entity52.entityKind] = "PgSparseVectorBuilder";
      constructor(name, config) {
        super(name, "string", "PgSparseVector");
        this.config.dimensions = config.dimensions;
      }
      /** @internal */
      build(table) {
        return new PgSparseVector(
          table,
          this.config
        );
      }
    };
    var PgSparseVector = class extends import_common9.PgColumn {
      static {
        __name(this, "PgSparseVector");
      }
      static [import_entity52.entityKind] = "PgSparseVector";
      dimensions = this.config.dimensions;
      getSQLType() {
        return `sparsevec(${this.dimensions})`;
      }
    };
    function sparsevec(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgSparseVectorBuilder(name, config);
    }
    __name(sparsevec, "sparsevec");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.cjs
var require_vector = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var vector_exports = {};
    __export2(vector_exports, {
      PgVector: /* @__PURE__ */ __name(() => PgVector, "PgVector"),
      PgVectorBuilder: /* @__PURE__ */ __name(() => PgVectorBuilder, "PgVectorBuilder"),
      vector: /* @__PURE__ */ __name(() => vector, "vector")
    });
    module.exports = __toCommonJS2(vector_exports);
    var import_entity52 = require_entity();
    var import_utils17 = require_utils();
    var import_common9 = require_common();
    var PgVectorBuilder = class extends import_common9.PgColumnBuilder {
      static {
        __name(this, "PgVectorBuilder");
      }
      static [import_entity52.entityKind] = "PgVectorBuilder";
      constructor(name, config) {
        super(name, "array", "PgVector");
        this.config.dimensions = config.dimensions;
      }
      /** @internal */
      build(table) {
        return new PgVector(
          table,
          this.config
        );
      }
    };
    var PgVector = class extends import_common9.PgColumn {
      static {
        __name(this, "PgVector");
      }
      static [import_entity52.entityKind] = "PgVector";
      dimensions = this.config.dimensions;
      getSQLType() {
        return `vector(${this.dimensions})`;
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
      mapFromDriverValue(value) {
        return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
      }
    };
    function vector(a, b) {
      const { name, config } = (0, import_utils17.getColumnNameAndConfig)(a, b);
      return new PgVectorBuilder(name, config);
    }
    __name(vector, "vector");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/all.cjs
var require_all = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/columns/all.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var all_exports = {};
    __export2(all_exports, {
      getPgColumnBuilders: /* @__PURE__ */ __name(() => getPgColumnBuilders, "getPgColumnBuilders")
    });
    module.exports = __toCommonJS2(all_exports);
    var import_bigint = require_bigint();
    var import_bigserial = require_bigserial();
    var import_boolean = require_boolean();
    var import_char = require_char();
    var import_cidr = require_cidr();
    var import_custom2 = require_custom();
    var import_date = require_date();
    var import_double_precision = require_double_precision();
    var import_inet = require_inet();
    var import_integer2 = require_integer();
    var import_interval = require_interval();
    var import_json = require_json();
    var import_jsonb = require_jsonb();
    var import_line = require_line();
    var import_macaddr = require_macaddr();
    var import_macaddr8 = require_macaddr8();
    var import_numeric2 = require_numeric();
    var import_point = require_point();
    var import_geometry = require_geometry();
    var import_real2 = require_real();
    var import_serial = require_serial();
    var import_smallint = require_smallint();
    var import_smallserial = require_smallserial();
    var import_text2 = require_text();
    var import_time = require_time();
    var import_timestamp = require_timestamp();
    var import_uuid = require_uuid();
    var import_varchar = require_varchar();
    var import_bit = require_bit();
    var import_halfvec = require_halfvec();
    var import_sparsevec = require_sparsevec();
    var import_vector = require_vector();
    function getPgColumnBuilders() {
      return {
        bigint: import_bigint.bigint,
        bigserial: import_bigserial.bigserial,
        boolean: import_boolean.boolean,
        char: import_char.char,
        cidr: import_cidr.cidr,
        customType: import_custom2.customType,
        date: import_date.date,
        doublePrecision: import_double_precision.doublePrecision,
        inet: import_inet.inet,
        integer: import_integer2.integer,
        interval: import_interval.interval,
        json: import_json.json,
        jsonb: import_jsonb.jsonb,
        line: import_line.line,
        macaddr: import_macaddr.macaddr,
        macaddr8: import_macaddr8.macaddr8,
        numeric: import_numeric2.numeric,
        point: import_point.point,
        geometry: import_geometry.geometry,
        real: import_real2.real,
        serial: import_serial.serial,
        smallint: import_smallint.smallint,
        smallserial: import_smallserial.smallserial,
        text: import_text2.text,
        time: import_time.time,
        timestamp: import_timestamp.timestamp,
        uuid: import_uuid.uuid,
        varchar: import_varchar.varchar,
        bit: import_bit.bit,
        halfvec: import_halfvec.halfvec,
        sparsevec: import_sparsevec.sparsevec,
        vector: import_vector.vector
      };
    }
    __name(getPgColumnBuilders, "getPgColumnBuilders");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/table.cjs
var require_table2 = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/table.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var table_exports = {};
    __export2(table_exports, {
      EnableRLS: /* @__PURE__ */ __name(() => EnableRLS2, "EnableRLS"),
      InlineForeignKeys: /* @__PURE__ */ __name(() => InlineForeignKeys3, "InlineForeignKeys"),
      PgTable: /* @__PURE__ */ __name(() => PgTable2, "PgTable"),
      pgTable: /* @__PURE__ */ __name(() => pgTable, "pgTable"),
      pgTableCreator: /* @__PURE__ */ __name(() => pgTableCreator, "pgTableCreator"),
      pgTableWithSchema: /* @__PURE__ */ __name(() => pgTableWithSchema, "pgTableWithSchema")
    });
    module.exports = __toCommonJS2(table_exports);
    var import_entity52 = require_entity();
    var import_table23 = require_table();
    var import_all2 = require_all();
    var InlineForeignKeys3 = /* @__PURE__ */ Symbol.for("drizzle:PgInlineForeignKeys");
    var EnableRLS2 = /* @__PURE__ */ Symbol.for("drizzle:EnableRLS");
    var PgTable2 = class extends import_table23.Table {
      static {
        __name(this, "PgTable");
      }
      static [import_entity52.entityKind] = "PgTable";
      /** @internal */
      static Symbol = Object.assign({}, import_table23.Table.Symbol, {
        InlineForeignKeys: InlineForeignKeys3,
        EnableRLS: EnableRLS2
      });
      /**@internal */
      [InlineForeignKeys3] = [];
      /** @internal */
      [EnableRLS2] = false;
      /** @internal */
      [import_table23.Table.Symbol.ExtraConfigBuilder] = void 0;
      /** @internal */
      [import_table23.Table.Symbol.ExtraConfigColumns] = {};
    };
    function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
      const rawTable = new PgTable2(name, schema, baseName);
      const parsedColumns = typeof columns === "function" ? columns((0, import_all2.getPgColumnBuilders)()) : columns;
      const builtColumns = Object.fromEntries(
        Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
          const colBuilder = colBuilderBase;
          colBuilder.setName(name2);
          const column = colBuilder.build(rawTable);
          rawTable[InlineForeignKeys3].push(...colBuilder.buildForeignKeys(column, rawTable));
          return [name2, column];
        })
      );
      const builtColumnsForExtraConfig = Object.fromEntries(
        Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
          const colBuilder = colBuilderBase;
          colBuilder.setName(name2);
          const column = colBuilder.buildExtraConfigColumn(rawTable);
          return [name2, column];
        })
      );
      const table = Object.assign(rawTable, builtColumns);
      table[import_table23.Table.Symbol.Columns] = builtColumns;
      table[import_table23.Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
      if (extraConfig) {
        table[PgTable2.Symbol.ExtraConfigBuilder] = extraConfig;
      }
      return Object.assign(table, {
        enableRLS: /* @__PURE__ */ __name(() => {
          table[PgTable2.Symbol.EnableRLS] = true;
          return table;
        }, "enableRLS")
      });
    }
    __name(pgTableWithSchema, "pgTableWithSchema");
    var pgTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
      return pgTableWithSchema(name, columns, extraConfig, void 0);
    }, "pgTable");
    function pgTableCreator(customizeTableName) {
      return (name, columns, extraConfig) => {
        return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
      };
    }
    __name(pgTableCreator, "pgTableCreator");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/primary-keys.cjs
var require_primary_keys = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/pg-core/primary-keys.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var primary_keys_exports = {};
    __export2(primary_keys_exports, {
      PrimaryKey: /* @__PURE__ */ __name(() => PrimaryKey3, "PrimaryKey"),
      PrimaryKeyBuilder: /* @__PURE__ */ __name(() => PrimaryKeyBuilder3, "PrimaryKeyBuilder"),
      primaryKey: /* @__PURE__ */ __name(() => primaryKey, "primaryKey")
    });
    module.exports = __toCommonJS2(primary_keys_exports);
    var import_entity52 = require_entity();
    var import_table23 = require_table2();
    function primaryKey(...config) {
      if (config[0].columns) {
        return new PrimaryKeyBuilder3(config[0].columns, config[0].name);
      }
      return new PrimaryKeyBuilder3(config);
    }
    __name(primaryKey, "primaryKey");
    var PrimaryKeyBuilder3 = class {
      static {
        __name(this, "PrimaryKeyBuilder");
      }
      static [import_entity52.entityKind] = "PgPrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey3(table, this.columns, this.name);
      }
    };
    var PrimaryKey3 = class {
      static {
        __name(this, "PrimaryKey");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [import_entity52.entityKind] = "PgPrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[import_table23.PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/conditions.cjs
var require_conditions = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/conditions.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var conditions_exports = {};
    __export2(conditions_exports, {
      and: /* @__PURE__ */ __name(() => and2, "and"),
      arrayContained: /* @__PURE__ */ __name(() => arrayContained, "arrayContained"),
      arrayContains: /* @__PURE__ */ __name(() => arrayContains, "arrayContains"),
      arrayOverlaps: /* @__PURE__ */ __name(() => arrayOverlaps, "arrayOverlaps"),
      between: /* @__PURE__ */ __name(() => between2, "between"),
      bindIfParam: /* @__PURE__ */ __name(() => bindIfParam2, "bindIfParam"),
      eq: /* @__PURE__ */ __name(() => eq2, "eq"),
      exists: /* @__PURE__ */ __name(() => exists2, "exists"),
      gt: /* @__PURE__ */ __name(() => gt2, "gt"),
      gte: /* @__PURE__ */ __name(() => gte2, "gte"),
      ilike: /* @__PURE__ */ __name(() => ilike2, "ilike"),
      inArray: /* @__PURE__ */ __name(() => inArray2, "inArray"),
      isNotNull: /* @__PURE__ */ __name(() => isNotNull2, "isNotNull"),
      isNull: /* @__PURE__ */ __name(() => isNull2, "isNull"),
      like: /* @__PURE__ */ __name(() => like2, "like"),
      lt: /* @__PURE__ */ __name(() => lt2, "lt"),
      lte: /* @__PURE__ */ __name(() => lte2, "lte"),
      ne: /* @__PURE__ */ __name(() => ne3, "ne"),
      not: /* @__PURE__ */ __name(() => not2, "not"),
      notBetween: /* @__PURE__ */ __name(() => notBetween2, "notBetween"),
      notExists: /* @__PURE__ */ __name(() => notExists2, "notExists"),
      notIlike: /* @__PURE__ */ __name(() => notIlike2, "notIlike"),
      notInArray: /* @__PURE__ */ __name(() => notInArray2, "notInArray"),
      notLike: /* @__PURE__ */ __name(() => notLike2, "notLike"),
      or: /* @__PURE__ */ __name(() => or2, "or")
    });
    module.exports = __toCommonJS2(conditions_exports);
    var import_column10 = require_column();
    var import_entity52 = require_entity();
    var import_table23 = require_table();
    var import_sql17 = require_sql();
    function bindIfParam2(value, column) {
      if ((0, import_sql17.isDriverValueEncoder)(column) && !(0, import_sql17.isSQLWrapper)(value) && !(0, import_entity52.is)(value, import_sql17.Param) && !(0, import_entity52.is)(value, import_sql17.Placeholder) && !(0, import_entity52.is)(value, import_column10.Column) && !(0, import_entity52.is)(value, import_table23.Table) && !(0, import_entity52.is)(value, import_sql17.View)) {
        return new import_sql17.Param(value, column);
      }
      return value;
    }
    __name(bindIfParam2, "bindIfParam");
    var eq2 = /* @__PURE__ */ __name((left, right) => {
      return import_sql17.sql`${left} = ${bindIfParam2(right, left)}`;
    }, "eq");
    var ne3 = /* @__PURE__ */ __name((left, right) => {
      return import_sql17.sql`${left} <> ${bindIfParam2(right, left)}`;
    }, "ne");
    function and2(...unfilteredConditions) {
      const conditions = unfilteredConditions.filter(
        (c) => c !== void 0
      );
      if (conditions.length === 0) {
        return void 0;
      }
      if (conditions.length === 1) {
        return new import_sql17.SQL(conditions);
      }
      return new import_sql17.SQL([
        new import_sql17.StringChunk("("),
        import_sql17.sql.join(conditions, new import_sql17.StringChunk(" and ")),
        new import_sql17.StringChunk(")")
      ]);
    }
    __name(and2, "and");
    function or2(...unfilteredConditions) {
      const conditions = unfilteredConditions.filter(
        (c) => c !== void 0
      );
      if (conditions.length === 0) {
        return void 0;
      }
      if (conditions.length === 1) {
        return new import_sql17.SQL(conditions);
      }
      return new import_sql17.SQL([
        new import_sql17.StringChunk("("),
        import_sql17.sql.join(conditions, new import_sql17.StringChunk(" or ")),
        new import_sql17.StringChunk(")")
      ]);
    }
    __name(or2, "or");
    function not2(condition) {
      return import_sql17.sql`not ${condition}`;
    }
    __name(not2, "not");
    var gt2 = /* @__PURE__ */ __name((left, right) => {
      return import_sql17.sql`${left} > ${bindIfParam2(right, left)}`;
    }, "gt");
    var gte2 = /* @__PURE__ */ __name((left, right) => {
      return import_sql17.sql`${left} >= ${bindIfParam2(right, left)}`;
    }, "gte");
    var lt2 = /* @__PURE__ */ __name((left, right) => {
      return import_sql17.sql`${left} < ${bindIfParam2(right, left)}`;
    }, "lt");
    var lte2 = /* @__PURE__ */ __name((left, right) => {
      return import_sql17.sql`${left} <= ${bindIfParam2(right, left)}`;
    }, "lte");
    function inArray2(column, values) {
      if (Array.isArray(values)) {
        if (values.length === 0) {
          return import_sql17.sql`false`;
        }
        return import_sql17.sql`${column} in ${values.map((v) => bindIfParam2(v, column))}`;
      }
      return import_sql17.sql`${column} in ${bindIfParam2(values, column)}`;
    }
    __name(inArray2, "inArray");
    function notInArray2(column, values) {
      if (Array.isArray(values)) {
        if (values.length === 0) {
          return import_sql17.sql`true`;
        }
        return import_sql17.sql`${column} not in ${values.map((v) => bindIfParam2(v, column))}`;
      }
      return import_sql17.sql`${column} not in ${bindIfParam2(values, column)}`;
    }
    __name(notInArray2, "notInArray");
    function isNull2(value) {
      return import_sql17.sql`${value} is null`;
    }
    __name(isNull2, "isNull");
    function isNotNull2(value) {
      return import_sql17.sql`${value} is not null`;
    }
    __name(isNotNull2, "isNotNull");
    function exists2(subquery) {
      return import_sql17.sql`exists ${subquery}`;
    }
    __name(exists2, "exists");
    function notExists2(subquery) {
      return import_sql17.sql`not exists ${subquery}`;
    }
    __name(notExists2, "notExists");
    function between2(column, min, max) {
      return import_sql17.sql`${column} between ${bindIfParam2(min, column)} and ${bindIfParam2(
        max,
        column
      )}`;
    }
    __name(between2, "between");
    function notBetween2(column, min, max) {
      return import_sql17.sql`${column} not between ${bindIfParam2(
        min,
        column
      )} and ${bindIfParam2(max, column)}`;
    }
    __name(notBetween2, "notBetween");
    function like2(column, value) {
      return import_sql17.sql`${column} like ${value}`;
    }
    __name(like2, "like");
    function notLike2(column, value) {
      return import_sql17.sql`${column} not like ${value}`;
    }
    __name(notLike2, "notLike");
    function ilike2(column, value) {
      return import_sql17.sql`${column} ilike ${value}`;
    }
    __name(ilike2, "ilike");
    function notIlike2(column, value) {
      return import_sql17.sql`${column} not ilike ${value}`;
    }
    __name(notIlike2, "notIlike");
    function arrayContains(column, values) {
      if (Array.isArray(values)) {
        if (values.length === 0) {
          throw new Error("arrayContains requires at least one value");
        }
        const array = import_sql17.sql`${bindIfParam2(values, column)}`;
        return import_sql17.sql`${column} @> ${array}`;
      }
      return import_sql17.sql`${column} @> ${bindIfParam2(values, column)}`;
    }
    __name(arrayContains, "arrayContains");
    function arrayContained(column, values) {
      if (Array.isArray(values)) {
        if (values.length === 0) {
          throw new Error("arrayContained requires at least one value");
        }
        const array = import_sql17.sql`${bindIfParam2(values, column)}`;
        return import_sql17.sql`${column} <@ ${array}`;
      }
      return import_sql17.sql`${column} <@ ${bindIfParam2(values, column)}`;
    }
    __name(arrayContained, "arrayContained");
    function arrayOverlaps(column, values) {
      if (Array.isArray(values)) {
        if (values.length === 0) {
          throw new Error("arrayOverlaps requires at least one value");
        }
        const array = import_sql17.sql`${bindIfParam2(values, column)}`;
        return import_sql17.sql`${column} && ${array}`;
      }
      return import_sql17.sql`${column} && ${bindIfParam2(values, column)}`;
    }
    __name(arrayOverlaps, "arrayOverlaps");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/select.cjs
var require_select = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/select.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc22) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc22 = __getOwnPropDesc2(from, key)) || desc22.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var select_exports = {};
    __export2(select_exports, {
      asc: /* @__PURE__ */ __name(() => asc2, "asc"),
      desc: /* @__PURE__ */ __name(() => desc2, "desc")
    });
    module.exports = __toCommonJS2(select_exports);
    var import_sql17 = require_sql();
    function asc2(column) {
      return import_sql17.sql`${column} asc`;
    }
    __name(asc2, "asc");
    function desc2(column) {
      return import_sql17.sql`${column} desc`;
    }
    __name(desc2, "desc");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/index.cjs
var require_expressions = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/expressions/index.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __reExport = /* @__PURE__ */ __name((target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default")), "__reExport");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var expressions_exports = {};
    module.exports = __toCommonJS2(expressions_exports);
    __reExport(expressions_exports, require_conditions(), module.exports);
    __reExport(expressions_exports, require_select(), module.exports);
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/relations.cjs
var require_relations = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/relations.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var relations_exports = {};
    __export2(relations_exports, {
      Many: /* @__PURE__ */ __name(() => Many2, "Many"),
      One: /* @__PURE__ */ __name(() => One2, "One"),
      Relation: /* @__PURE__ */ __name(() => Relation2, "Relation"),
      Relations: /* @__PURE__ */ __name(() => Relations2, "Relations"),
      createMany: /* @__PURE__ */ __name(() => createMany2, "createMany"),
      createOne: /* @__PURE__ */ __name(() => createOne2, "createOne"),
      createTableRelationsHelpers: /* @__PURE__ */ __name(() => createTableRelationsHelpers2, "createTableRelationsHelpers"),
      extractTablesRelationalConfig: /* @__PURE__ */ __name(() => extractTablesRelationalConfig2, "extractTablesRelationalConfig"),
      getOperators: /* @__PURE__ */ __name(() => getOperators2, "getOperators"),
      getOrderByOperators: /* @__PURE__ */ __name(() => getOrderByOperators2, "getOrderByOperators"),
      mapRelationalRow: /* @__PURE__ */ __name(() => mapRelationalRow2, "mapRelationalRow"),
      normalizeRelation: /* @__PURE__ */ __name(() => normalizeRelation2, "normalizeRelation"),
      relations: /* @__PURE__ */ __name(() => relations, "relations")
    });
    module.exports = __toCommonJS2(relations_exports);
    var import_table23 = require_table();
    var import_column10 = require_column();
    var import_entity52 = require_entity();
    var import_primary_keys2 = require_primary_keys();
    var import_expressions2 = require_expressions();
    var import_sql17 = require_sql();
    var Relation2 = class {
      static {
        __name(this, "Relation");
      }
      constructor(sourceTable, referencedTable, relationName) {
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[import_table23.Table.Symbol.Name];
      }
      static [import_entity52.entityKind] = "Relation";
      referencedTableName;
      fieldName;
    };
    var Relations2 = class {
      static {
        __name(this, "Relations");
      }
      constructor(table, config) {
        this.table = table;
        this.config = config;
      }
      static [import_entity52.entityKind] = "Relations";
    };
    var One2 = class _One extends Relation2 {
      static {
        __name(this, "One");
      }
      constructor(sourceTable, referencedTable, config, isNullable) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
      }
      static [import_entity52.entityKind] = "One";
      withFieldName(fieldName) {
        const relation = new _One(
          this.sourceTable,
          this.referencedTable,
          this.config,
          this.isNullable
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    var Many2 = class _Many extends Relation2 {
      static {
        __name(this, "Many");
      }
      constructor(sourceTable, referencedTable, config) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
      }
      static [import_entity52.entityKind] = "Many";
      withFieldName(fieldName) {
        const relation = new _Many(
          this.sourceTable,
          this.referencedTable,
          this.config
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    function getOperators2() {
      return {
        and: import_expressions2.and,
        between: import_expressions2.between,
        eq: import_expressions2.eq,
        exists: import_expressions2.exists,
        gt: import_expressions2.gt,
        gte: import_expressions2.gte,
        ilike: import_expressions2.ilike,
        inArray: import_expressions2.inArray,
        isNull: import_expressions2.isNull,
        isNotNull: import_expressions2.isNotNull,
        like: import_expressions2.like,
        lt: import_expressions2.lt,
        lte: import_expressions2.lte,
        ne: import_expressions2.ne,
        not: import_expressions2.not,
        notBetween: import_expressions2.notBetween,
        notExists: import_expressions2.notExists,
        notLike: import_expressions2.notLike,
        notIlike: import_expressions2.notIlike,
        notInArray: import_expressions2.notInArray,
        or: import_expressions2.or,
        sql: import_sql17.sql
      };
    }
    __name(getOperators2, "getOperators");
    function getOrderByOperators2() {
      return {
        sql: import_sql17.sql,
        asc: import_expressions2.asc,
        desc: import_expressions2.desc
      };
    }
    __name(getOrderByOperators2, "getOrderByOperators");
    function extractTablesRelationalConfig2(schema, configHelpers) {
      if (Object.keys(schema).length === 1 && "default" in schema && !(0, import_entity52.is)(schema["default"], import_table23.Table)) {
        schema = schema["default"];
      }
      const tableNamesMap = {};
      const relationsBuffer = {};
      const tablesConfig = {};
      for (const [key, value] of Object.entries(schema)) {
        if ((0, import_entity52.is)(value, import_table23.Table)) {
          const dbName = (0, import_table23.getTableUniqueName)(value);
          const bufferedRelations = relationsBuffer[dbName];
          tableNamesMap[dbName] = key;
          tablesConfig[key] = {
            tsName: key,
            dbName: value[import_table23.Table.Symbol.Name],
            schema: value[import_table23.Table.Symbol.Schema],
            columns: value[import_table23.Table.Symbol.Columns],
            relations: bufferedRelations?.relations ?? {},
            primaryKey: bufferedRelations?.primaryKey ?? []
          };
          for (const column of Object.values(
            value[import_table23.Table.Symbol.Columns]
          )) {
            if (column.primary) {
              tablesConfig[key].primaryKey.push(column);
            }
          }
          const extraConfig = value[import_table23.Table.Symbol.ExtraConfigBuilder]?.(value[import_table23.Table.Symbol.ExtraConfigColumns]);
          if (extraConfig) {
            for (const configEntry of Object.values(extraConfig)) {
              if ((0, import_entity52.is)(configEntry, import_primary_keys2.PrimaryKeyBuilder)) {
                tablesConfig[key].primaryKey.push(...configEntry.columns);
              }
            }
          }
        } else if ((0, import_entity52.is)(value, Relations2)) {
          const dbName = (0, import_table23.getTableUniqueName)(value.table);
          const tableName = tableNamesMap[dbName];
          const relations2 = value.config(
            configHelpers(value.table)
          );
          let primaryKey;
          for (const [relationName, relation] of Object.entries(relations2)) {
            if (tableName) {
              const tableConfig = tablesConfig[tableName];
              tableConfig.relations[relationName] = relation;
              if (primaryKey) {
                tableConfig.primaryKey.push(...primaryKey);
              }
            } else {
              if (!(dbName in relationsBuffer)) {
                relationsBuffer[dbName] = {
                  relations: {},
                  primaryKey
                };
              }
              relationsBuffer[dbName].relations[relationName] = relation;
            }
          }
        }
      }
      return { tables: tablesConfig, tableNamesMap };
    }
    __name(extractTablesRelationalConfig2, "extractTablesRelationalConfig");
    function relations(table, relations2) {
      return new Relations2(
        table,
        (helpers) => Object.fromEntries(
          Object.entries(relations2(helpers)).map(([key, value]) => [
            key,
            value.withFieldName(key)
          ])
        )
      );
    }
    __name(relations, "relations");
    function createOne2(sourceTable) {
      return /* @__PURE__ */ __name(function one(table, config) {
        return new One2(
          sourceTable,
          table,
          config,
          config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
        );
      }, "one");
    }
    __name(createOne2, "createOne");
    function createMany2(sourceTable) {
      return /* @__PURE__ */ __name(function many(referencedTable, config) {
        return new Many2(sourceTable, referencedTable, config);
      }, "many");
    }
    __name(createMany2, "createMany");
    function normalizeRelation2(schema, tableNamesMap, relation) {
      if ((0, import_entity52.is)(relation, One2) && relation.config) {
        return {
          fields: relation.config.fields,
          references: relation.config.references
        };
      }
      const referencedTableTsName = tableNamesMap[(0, import_table23.getTableUniqueName)(relation.referencedTable)];
      if (!referencedTableTsName) {
        throw new Error(
          `Table "${relation.referencedTable[import_table23.Table.Symbol.Name]}" not found in schema`
        );
      }
      const referencedTableConfig = schema[referencedTableTsName];
      if (!referencedTableConfig) {
        throw new Error(`Table "${referencedTableTsName}" not found in schema`);
      }
      const sourceTable = relation.sourceTable;
      const sourceTableTsName = tableNamesMap[(0, import_table23.getTableUniqueName)(sourceTable)];
      if (!sourceTableTsName) {
        throw new Error(
          `Table "${sourceTable[import_table23.Table.Symbol.Name]}" not found in schema`
        );
      }
      const reverseRelations = [];
      for (const referencedTableRelation of Object.values(
        referencedTableConfig.relations
      )) {
        if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
          reverseRelations.push(referencedTableRelation);
        }
      }
      if (reverseRelations.length > 1) {
        throw relation.relationName ? new Error(
          `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
        ) : new Error(
          `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[import_table23.Table.Symbol.Name]}". Please specify relation name`
        );
      }
      if (reverseRelations[0] && (0, import_entity52.is)(reverseRelations[0], One2) && reverseRelations[0].config) {
        return {
          fields: reverseRelations[0].config.references,
          references: reverseRelations[0].config.fields
        };
      }
      throw new Error(
        `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
      );
    }
    __name(normalizeRelation2, "normalizeRelation");
    function createTableRelationsHelpers2(sourceTable) {
      return {
        one: createOne2(sourceTable),
        many: createMany2(sourceTable)
      };
    }
    __name(createTableRelationsHelpers2, "createTableRelationsHelpers");
    function mapRelationalRow2(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
      const result = {};
      for (const [
        selectionItemIndex,
        selectionItem
      ] of buildQueryResultSelection.entries()) {
        if (selectionItem.isJson) {
          const relation = tableConfig.relations[selectionItem.tsKey];
          const rawSubRows = row[selectionItemIndex];
          const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
          result[selectionItem.tsKey] = (0, import_entity52.is)(relation, One2) ? subRows && mapRelationalRow2(
            tablesConfig,
            tablesConfig[selectionItem.relationTableTsKey],
            subRows,
            selectionItem.selection,
            mapColumnValue
          ) : subRows.map(
            (subRow) => mapRelationalRow2(
              tablesConfig,
              tablesConfig[selectionItem.relationTableTsKey],
              subRow,
              selectionItem.selection,
              mapColumnValue
            )
          );
        } else {
          const value = mapColumnValue(row[selectionItemIndex]);
          const field = selectionItem.field;
          let decoder;
          if ((0, import_entity52.is)(field, import_column10.Column)) {
            decoder = field;
          } else if ((0, import_entity52.is)(field, import_sql17.SQL)) {
            decoder = field.decoder;
          } else {
            decoder = field.sql.decoder;
          }
          result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
        }
      }
      return result;
    }
    __name(mapRelationalRow2, "mapRelationalRow");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/aggregate.cjs
var require_aggregate = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/aggregate.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var aggregate_exports = {};
    __export2(aggregate_exports, {
      avg: /* @__PURE__ */ __name(() => avg, "avg"),
      avgDistinct: /* @__PURE__ */ __name(() => avgDistinct, "avgDistinct"),
      count: /* @__PURE__ */ __name(() => count, "count"),
      countDistinct: /* @__PURE__ */ __name(() => countDistinct, "countDistinct"),
      max: /* @__PURE__ */ __name(() => max, "max"),
      min: /* @__PURE__ */ __name(() => min, "min"),
      sum: /* @__PURE__ */ __name(() => sum, "sum"),
      sumDistinct: /* @__PURE__ */ __name(() => sumDistinct, "sumDistinct")
    });
    module.exports = __toCommonJS2(aggregate_exports);
    var import_column10 = require_column();
    var import_entity52 = require_entity();
    var import_sql17 = require_sql();
    function count(expression) {
      return import_sql17.sql`count(${expression || import_sql17.sql.raw("*")})`.mapWith(Number);
    }
    __name(count, "count");
    function countDistinct(expression) {
      return import_sql17.sql`count(distinct ${expression})`.mapWith(Number);
    }
    __name(countDistinct, "countDistinct");
    function avg(expression) {
      return import_sql17.sql`avg(${expression})`.mapWith(String);
    }
    __name(avg, "avg");
    function avgDistinct(expression) {
      return import_sql17.sql`avg(distinct ${expression})`.mapWith(String);
    }
    __name(avgDistinct, "avgDistinct");
    function sum(expression) {
      return import_sql17.sql`sum(${expression})`.mapWith(String);
    }
    __name(sum, "sum");
    function sumDistinct(expression) {
      return import_sql17.sql`sum(distinct ${expression})`.mapWith(String);
    }
    __name(sumDistinct, "sumDistinct");
    function max(expression) {
      return import_sql17.sql`max(${expression})`.mapWith((0, import_entity52.is)(expression, import_column10.Column) ? expression : String);
    }
    __name(max, "max");
    function min(expression) {
      return import_sql17.sql`min(${expression})`.mapWith((0, import_entity52.is)(expression, import_column10.Column) ? expression : String);
    }
    __name(min, "min");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/vector.cjs
var require_vector2 = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/vector.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var vector_exports = {};
    __export2(vector_exports, {
      cosineDistance: /* @__PURE__ */ __name(() => cosineDistance, "cosineDistance"),
      hammingDistance: /* @__PURE__ */ __name(() => hammingDistance, "hammingDistance"),
      innerProduct: /* @__PURE__ */ __name(() => innerProduct, "innerProduct"),
      jaccardDistance: /* @__PURE__ */ __name(() => jaccardDistance, "jaccardDistance"),
      l1Distance: /* @__PURE__ */ __name(() => l1Distance, "l1Distance"),
      l2Distance: /* @__PURE__ */ __name(() => l2Distance, "l2Distance")
    });
    module.exports = __toCommonJS2(vector_exports);
    var import_sql17 = require_sql();
    function toSql(value) {
      return JSON.stringify(value);
    }
    __name(toSql, "toSql");
    function l2Distance(column, value) {
      if (Array.isArray(value)) {
        return import_sql17.sql`${column} <-> ${toSql(value)}`;
      }
      return import_sql17.sql`${column} <-> ${value}`;
    }
    __name(l2Distance, "l2Distance");
    function l1Distance(column, value) {
      if (Array.isArray(value)) {
        return import_sql17.sql`${column} <+> ${toSql(value)}`;
      }
      return import_sql17.sql`${column} <+> ${value}`;
    }
    __name(l1Distance, "l1Distance");
    function innerProduct(column, value) {
      if (Array.isArray(value)) {
        return import_sql17.sql`${column} <#> ${toSql(value)}`;
      }
      return import_sql17.sql`${column} <#> ${value}`;
    }
    __name(innerProduct, "innerProduct");
    function cosineDistance(column, value) {
      if (Array.isArray(value)) {
        return import_sql17.sql`${column} <=> ${toSql(value)}`;
      }
      return import_sql17.sql`${column} <=> ${value}`;
    }
    __name(cosineDistance, "cosineDistance");
    function hammingDistance(column, value) {
      if (Array.isArray(value)) {
        return import_sql17.sql`${column} <~> ${toSql(value)}`;
      }
      return import_sql17.sql`${column} <~> ${value}`;
    }
    __name(hammingDistance, "hammingDistance");
    function jaccardDistance(column, value) {
      if (Array.isArray(value)) {
        return import_sql17.sql`${column} <%> ${toSql(value)}`;
      }
      return import_sql17.sql`${column} <%> ${value}`;
    }
    __name(jaccardDistance, "jaccardDistance");
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/index.cjs
var require_functions = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/functions/index.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __reExport = /* @__PURE__ */ __name((target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default")), "__reExport");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var functions_exports = {};
    module.exports = __toCommonJS2(functions_exports);
    __reExport(functions_exports, require_aggregate(), module.exports);
    __reExport(functions_exports, require_vector2(), module.exports);
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/index.cjs
var require_sql2 = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/sql/index.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __reExport = /* @__PURE__ */ __name((target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default")), "__reExport");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var sql_exports = {};
    module.exports = __toCommonJS2(sql_exports);
    __reExport(sql_exports, require_expressions(), module.exports);
    __reExport(sql_exports, require_functions(), module.exports);
    __reExport(sql_exports, require_sql(), module.exports);
  }
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/index.cjs
var require_drizzle_orm = __commonJS({
  "../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/index.cjs"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except2, desc2) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except2)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
      }
      return to;
    }, "__copyProps");
    var __reExport = /* @__PURE__ */ __name((target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default")), "__reExport");
    var __toCommonJS2 = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var index_exports = {};
    module.exports = __toCommonJS2(index_exports);
    __reExport(index_exports, require_alias(), module.exports);
    __reExport(index_exports, require_column_builder(), module.exports);
    __reExport(index_exports, require_column(), module.exports);
    __reExport(index_exports, require_entity(), module.exports);
    __reExport(index_exports, require_errors(), module.exports);
    __reExport(index_exports, require_logger(), module.exports);
    __reExport(index_exports, require_operations(), module.exports);
    __reExport(index_exports, require_query_promise(), module.exports);
    __reExport(index_exports, require_relations(), module.exports);
    __reExport(index_exports, require_sql2(), module.exports);
    __reExport(index_exports, require_subquery(), module.exports);
    __reExport(index_exports, require_table(), module.exports);
    __reExport(index_exports, require_utils(), module.exports);
    __reExport(index_exports, require_view_common(), module.exports);
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js
var require_utils3 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = /* @__PURE__ */ __name(function getSymbolSize(version2) {
      if (!version2) throw new Error('"version" cannot be null or undefined');
      if (version2 < 1 || version2 > 40) throw new Error('"version" should be in range from 1 to 40');
      return version2 * 4 + 17;
    }, "getSymbolSize");
    exports.getSymbolTotalCodewords = /* @__PURE__ */ __name(function getSymbolTotalCodewords(version2) {
      return CODEWORDS_COUNT[version2];
    }, "getSymbolTotalCodewords");
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = /* @__PURE__ */ __name(function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    }, "setToSJISFunction");
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = /* @__PURE__ */ __name(function toSJIS(kanji) {
      return toSJISFunction(kanji);
    }, "toSJIS");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    __name(fromString, "fromString");
    exports.isValid = /* @__PURE__ */ __name(function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    }, "isValid");
    exports.from = /* @__PURE__ */ __name(function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    }, "from");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    __name(BitBuffer, "BitBuffer");
    BitBuffer.prototype = {
      get: /* @__PURE__ */ __name(function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      }, "get"),
      put: /* @__PURE__ */ __name(function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      }, "put"),
      getLengthInBits: /* @__PURE__ */ __name(function() {
        return this.length;
      }, "getLengthInBits"),
      putBit: /* @__PURE__ */ __name(function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }, "putBit")
    };
    module.exports = BitBuffer;
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    __name(BitMatrix, "BitMatrix");
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var getSymbolSize = require_utils3().getSymbolSize;
    exports.getRowColCoords = /* @__PURE__ */ __name(function getRowColCoords(version2) {
      if (version2 === 1) return [];
      const posCount = Math.floor(version2 / 7) + 2;
      const size = getSymbolSize(version2);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    }, "getRowColCoords");
    exports.getPositions = /* @__PURE__ */ __name(function getPositions(version2) {
      const coords = [];
      const pos = exports.getRowColCoords(version2);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    }, "getPositions");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var getSymbolSize = require_utils3().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = /* @__PURE__ */ __name(function getPositions(version2) {
      const size = getSymbolSize(version2);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    }, "getPositions");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = /* @__PURE__ */ __name(function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    }, "isValid");
    exports.from = /* @__PURE__ */ __name(function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    }, "from");
    exports.getPenaltyN1 = /* @__PURE__ */ __name(function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    }, "getPenaltyN1");
    exports.getPenaltyN2 = /* @__PURE__ */ __name(function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    }, "getPenaltyN2");
    exports.getPenaltyN3 = /* @__PURE__ */ __name(function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    }, "getPenaltyN3");
    exports.getPenaltyN4 = /* @__PURE__ */ __name(function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    }, "getPenaltyN4");
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    __name(getMaskAt, "getMaskAt");
    exports.applyMask = /* @__PURE__ */ __name(function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    }, "applyMask");
    exports.getBestMask = /* @__PURE__ */ __name(function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    }, "getBestMask");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = /* @__PURE__ */ __name(function getBlocksCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    }, "getBlocksCount");
    exports.getTotalCodewordsCount = /* @__PURE__ */ __name(function getTotalCodewordsCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    }, "getTotalCodewordsCount");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (/* @__PURE__ */ __name(function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    }, "initTables"))();
    exports.log = /* @__PURE__ */ __name(function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    }, "log");
    exports.exp = /* @__PURE__ */ __name(function exp(n) {
      return EXP_TABLE[n];
    }, "exp");
    exports.mul = /* @__PURE__ */ __name(function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    }, "mul");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var GF = require_galois_field();
    exports.mul = /* @__PURE__ */ __name(function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    }, "mul");
    exports.mod = /* @__PURE__ */ __name(function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    }, "mod");
    exports.generateECPolynomial = /* @__PURE__ */ __name(function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    }, "generateECPolynomial");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    __name(ReedSolomonEncoder, "ReedSolomonEncoder");
    ReedSolomonEncoder.prototype.initialize = /* @__PURE__ */ __name(function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    }, "initialize");
    ReedSolomonEncoder.prototype.encode = /* @__PURE__ */ __name(function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    }, "encode");
    module.exports = ReedSolomonEncoder;
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    exports.isValid = /* @__PURE__ */ __name(function isValid(version2) {
      return !isNaN(version2) && version2 >= 1 && version2 <= 40;
    }, "isValid");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var numeric2 = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric2, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric2 + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = /* @__PURE__ */ __name(function testKanji(str) {
      return TEST_KANJI.test(str);
    }, "testKanji");
    exports.testNumeric = /* @__PURE__ */ __name(function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    }, "testNumeric");
    exports.testAlphanumeric = /* @__PURE__ */ __name(function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    }, "testAlphanumeric");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = /* @__PURE__ */ __name(function getCharCountIndicator(mode, version2) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid version: " + version2);
      }
      if (version2 >= 1 && version2 < 10) return mode.ccBits[0];
      else if (version2 < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    }, "getCharCountIndicator");
    exports.getBestModeForData = /* @__PURE__ */ __name(function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    }, "getBestModeForData");
    exports.toString = /* @__PURE__ */ __name(function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    }, "toString");
    exports.isValid = /* @__PURE__ */ __name(function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    }, "isValid");
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    __name(fromString, "fromString");
    exports.from = /* @__PURE__ */ __name(function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    }, "from");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js
var require_version2 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Utils = require_utils3();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    __name(getBestVersionForDataLength, "getBestVersionForDataLength");
    function getReservedBitsCount(mode, version2) {
      return Mode.getCharCountIndicator(mode, version2) + 4;
    }
    __name(getReservedBitsCount, "getReservedBitsCount");
    function getTotalBitsFromDataArray(segments, version2) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version2);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    __name(getTotalBitsFromDataArray, "getTotalBitsFromDataArray");
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    __name(getBestVersionForMixedData, "getBestVersionForMixedData");
    exports.from = /* @__PURE__ */ __name(function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    }, "from");
    exports.getCapacity = /* @__PURE__ */ __name(function getCapacity(version2, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version2);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    }, "getCapacity");
    exports.getBestVersionForData = /* @__PURE__ */ __name(function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    }, "getBestVersionForData");
    exports.getEncodedBits = /* @__PURE__ */ __name(function getEncodedBits(version2) {
      if (!VersionCheck.isValid(version2) || version2 < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version2 << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version2 << 12 | d;
    }, "getEncodedBits");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Utils = require_utils3();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = /* @__PURE__ */ __name(function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    }, "getEncodedBits");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    __name(NumericData, "NumericData");
    NumericData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    }, "getBitsLength");
    NumericData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    NumericData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    }, "getBitsLength");
    NumericData.prototype.write = /* @__PURE__ */ __name(function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    }, "write");
    module.exports = NumericData;
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    __name(AlphanumericData, "AlphanumericData");
    AlphanumericData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    }, "getBitsLength");
    AlphanumericData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    AlphanumericData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    }, "getBitsLength");
    AlphanumericData.prototype.write = /* @__PURE__ */ __name(function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    }, "write");
    module.exports = AlphanumericData;
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    __name(ByteData, "ByteData");
    ByteData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return length * 8;
    }, "getBitsLength");
    ByteData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    ByteData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    }, "getBitsLength");
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Mode = require_mode();
    var Utils = require_utils3();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    __name(KanjiData, "KanjiData");
    KanjiData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return length * 13;
    }, "getBitsLength");
    KanjiData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    KanjiData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    }, "getBitsLength");
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// ../../node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "../../node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var dijkstra = {
      single_source_shortest_paths: /* @__PURE__ */ __name(function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      }, "single_source_shortest_paths"),
      extract_shortest_path_from_predecessor_list: /* @__PURE__ */ __name(function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      }, "extract_shortest_path_from_predecessor_list"),
      find_path: /* @__PURE__ */ __name(function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      }, "find_path"),
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: /* @__PURE__ */ __name(function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        }, "make"),
        default_sorter: /* @__PURE__ */ __name(function(a, b) {
          return a.cost - b.cost;
        }, "default_sorter"),
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: /* @__PURE__ */ __name(function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        }, "push"),
        /**
         * Return the highest priority element in the queue.
         */
        pop: /* @__PURE__ */ __name(function() {
          return this.queue.shift();
        }, "pop"),
        empty: /* @__PURE__ */ __name(function() {
          return this.queue.length === 0;
        }, "empty")
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils3();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    __name(getStringByteLength, "getStringByteLength");
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    __name(getSegments, "getSegments");
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    __name(getSegmentsFromString, "getSegmentsFromString");
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    __name(getSegmentBitsLength, "getSegmentBitsLength");
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    __name(mergeSegments, "mergeSegments");
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    __name(buildNodes, "buildNodes");
    function buildGraph(nodes, version2) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version2);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    __name(buildGraph, "buildGraph");
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    __name(buildSingleSegment, "buildSingleSegment");
    exports.fromArray = /* @__PURE__ */ __name(function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    }, "fromArray");
    exports.fromString = /* @__PURE__ */ __name(function fromString(data, version2) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version2);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    }, "fromString");
    exports.rawSplit = /* @__PURE__ */ __name(function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    }, "rawSplit");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Utils = require_utils3();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version2();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version2) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    __name(setupFinderPattern, "setupFinderPattern");
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    __name(setupTimingPattern, "setupTimingPattern");
    function setupAlignmentPattern(matrix, version2) {
      const pos = AlignmentPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    __name(setupAlignmentPattern, "setupAlignmentPattern");
    function setupVersionInfo(matrix, version2) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version2);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    __name(setupVersionInfo, "setupVersionInfo");
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    __name(setupFormatInfo, "setupFormatInfo");
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    __name(setupData, "setupData");
    function createData(version2, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version2, errorCorrectionLevel);
    }
    __name(createData, "createData");
    function createCodewords(bitBuffer, version2, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    __name(createCodewords, "createCodewords");
    function createSymbol(data, version2, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version2;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version2) {
        version2 = bestVersion;
      } else if (version2 < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version2, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version2);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version2);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version2);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version2 >= 7) {
        setupVersionInfo(modules, version2);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version: version2,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    __name(createSymbol, "createSymbol");
    exports.create = /* @__PURE__ */ __name(function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version2;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version2 = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version2, errorCorrectionLevel, mask);
    }, "create");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js
var require_utils4 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    __name(hex2rgba, "hex2rgba");
    exports.getOptions = /* @__PURE__ */ __name(function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    }, "getOptions");
    exports.getScale = /* @__PURE__ */ __name(function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    }, "getScale");
    exports.getImageWidth = /* @__PURE__ */ __name(function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    }, "getImageWidth");
    exports.qrToImageData = /* @__PURE__ */ __name(function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    }, "qrToImageData");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Utils = require_utils4();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    __name(clearCanvas, "clearCanvas");
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    __name(getCanvasElement, "getCanvasElement");
    exports.render = /* @__PURE__ */ __name(function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    }, "render");
    exports.renderToDataURL = /* @__PURE__ */ __name(function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    }, "renderToDataURL");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var Utils = require_utils4();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    __name(getColorAttrib, "getColorAttrib");
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    __name(svgCmd, "svgCmd");
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    __name(qrToPath, "qrToPath");
    exports.render = /* @__PURE__ */ __name(function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    }, "render");
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text2, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text2;
          text2 = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text2;
            text2 = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text2 = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text2;
          text2 = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text2, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text2, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    __name(renderCanvas, "renderCanvas");
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// .wrangler/tmp/bundle-O98dHm/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-O98dHm/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.ts
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/hono.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/hono-base.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/compose.js
init_checked_fetch();
init_modules_watch_stub();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/context.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/request.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/http-exception.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/request/constants.js
init_checked_fetch();
init_modules_watch_stub();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/body.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/buffer.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/crypto.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
}, "bufferToFormData");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/body.js
var isRawRequest = /* @__PURE__ */ __name((request) => "headers" in request, "isRawRequest");
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(
      await request.bodyCache.formData,
      options
    );
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/url.js
init_checked_fetch();
init_modules_watch_stub();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str, "tryDecodeURIComponent");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value);
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/request.js
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = tryDecodeURIComponent(value);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text2) => JSON.parse(text2));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    ;
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/html.js
init_checked_fetch();
init_modules_watch_stub();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) {
          if (++count > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers();
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text2, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(
      text2,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router.js
init_checked_fetch();
init_modules_watch_stub();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/constants.js
init_checked_fetch();
init_modules_watch_stub();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} env - env Object
   * @param {ExecutionContext} executionCtx - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/matcher.js
init_checked_fetch();
init_modules_watch_stub();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  // handler index of a dynamic path, or -1 for a static path terminal
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if (
                // a single-char pattern coexists with single-char literals as a literal does
                (regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
              ) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/trie.js
init_checked_fetch();
init_modules_watch_stub();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  // dynamic path -> [handler index, param assoc]; static paths are not registered
  paths = /* @__PURE__ */ Object.create(null);
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#tries = { [METHOD_NAME_ALL]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      Object.keys(middleware).forEach((m) => {
        if ((method === METHOD_NAME_ALL || method === m) && !middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      });
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          if (!routes[m][path2]) {
            this.#insertPath(m, path2);
            routes[m][path2] = [
              ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
            ];
          }
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = this.#tries = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = /* @__PURE__ */ Object.create(null);
    const handlerData = [];
    [middleware, routes].forEach((r) => {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
          continue;
        }
        const paramAssoc = pathData[1];
        handlerData[pathData[0]] = handlers.map(([h, paramCount]) => {
          const paramIndexMap = /* @__PURE__ */ Object.create(null);
          paramCount -= 1;
          for (; paramCount >= 0; paramCount--) {
            const [key, value] = paramAssoc[paramCount];
            paramIndexMap[key] = value;
          }
          return [h, paramIndexMap];
        });
      }
    });
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (let i = 0, len = handlerData.length; i < len; i++) {
      for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
        const map = handlerData[i][j]?.[1];
        if (!map) {
          continue;
        }
        const keys = Object.keys(map);
        for (let k = 0, len3 = keys.length; k < len3; k++) {
          map[keys[k]] = paramReplacementMap[map[keys[k]]];
        }
      }
    }
    const handlerMap = [];
    for (const i in indexReplacementMap) {
      handlerMap[i] = handlerData[indexReplacementMap[i]];
    }
    return [regexp, handlerMap, staticMap];
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/smart-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/smart-router/router.js
init_checked_fetch();
init_modules_watch_stub();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/trie-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/trie-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/trie-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/middleware/cors/index.js
init_checked_fetch();
init_modules_watch_stub();
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "QUERY"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(",").map((h) => h.trim());
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/db.ts
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/d1/driver.js
init_checked_fetch();
init_modules_watch_stub();
init_entity();

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/logger.js
init_checked_fetch();
init_modules_watch_stub();
init_entity();
var ConsoleLogWriter = class {
  static {
    __name(this, "ConsoleLogWriter");
  }
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static {
    __name(this, "DefaultLogger");
  }
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static {
    __name(this, "NoopLogger");
  }
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/d1/driver.js
init_relations();
init_db();
init_dialect();

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/d1/session.js
init_checked_fetch();
init_modules_watch_stub();
init_entity();
init_sql();
init_sqlite_core();
init_session();
init_utils();
var SQLiteD1Session = class extends SQLiteSession {
  static {
    __name(this, "SQLiteD1Session");
  }
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "SQLiteD1Session";
  logger;
  cache;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    const stmt = this.client.prepare(query.sql);
    return new D1PreparedQuery(
      stmt,
      query,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      if (builtQuery.params.length > 0) {
        builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
      } else {
        const builtQuery2 = preparedQuery.getQuery();
        builtQueries.push(
          this.client.prepare(builtQuery2.sql).bind(...builtQuery2.params)
        );
      }
    }
    const batchResults = await this.client.batch(builtQueries);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  extractRawAllValueFromBatchResult(result) {
    return result.results;
  }
  extractRawGetValueFromBatchResult(result) {
    return result.results[0];
  }
  extractRawValuesValueFromBatchResult(result) {
    return d1ToRawMapping(result.results);
  }
  async transaction(transaction, config) {
    const tx = new D1Transaction("async", this.dialect, this, this.schema);
    await this.run(sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
    try {
      const result = await transaction(tx);
      await this.run(sql`commit`);
      return result;
    } catch (err) {
      await this.run(sql`rollback`);
      throw err;
    }
  }
};
var D1Transaction = class _D1Transaction extends SQLiteTransaction {
  static {
    __name(this, "D1Transaction");
  }
  static [entityKind] = "D1Transaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new _D1Transaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};
function d1ToRawMapping(results) {
  const rows = [];
  for (const row of results) {
    const entry = Object.keys(row).map((k) => row[k]);
    rows.push(entry);
  }
  return rows;
}
__name(d1ToRawMapping, "d1ToRawMapping");
var D1PreparedQuery = class extends SQLitePreparedQuery {
  static {
    __name(this, "D1PreparedQuery");
  }
  constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
    this.logger = logger;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.fields = fields;
    this.stmt = stmt;
  }
  static [entityKind] = "D1PreparedQuery";
  /** @internal */
  customResultMapper;
  /** @internal */
  fields;
  /** @internal */
  stmt;
  async run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.stmt.bind(...params).run();
    });
  }
  async all(placeholderValues) {
    const { fields, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
      });
    }
    const rows = await this.values(placeholderValues);
    return this.mapAllResult(rows);
  }
  mapAllResult(rows, isFromBatch) {
    if (isFromBatch) {
      rows = d1ToRawMapping(rows.results);
    }
    if (!this.fields && !this.customResultMapper) {
      return rows;
    }
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
  }
  async get(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return stmt.bind(...params).all().then(({ results }) => results[0]);
      });
    }
    const rows = await this.values(placeholderValues);
    if (!rows[0]) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return mapResultRow(fields, rows[0], joinsNotNullableMap);
  }
  mapGetResult(result, isFromBatch) {
    if (isFromBatch) {
      result = d1ToRawMapping(result.results)[0];
    }
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    if (this.customResultMapper) {
      return this.customResultMapper([result]);
    }
    return mapResultRow(this.fields, result, this.joinsNotNullableMap);
  }
  async values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.stmt.bind(...params).raw();
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@cloudflare+workers-types@5.20260813.1_@libsql+client@0.17.4/node_modules/drizzle-orm/d1/driver.js
var DrizzleD1Database = class extends BaseSQLiteDatabase {
  static {
    __name(this, "DrizzleD1Database");
  }
  static [entityKind] = "D1Database";
  async batch(batch) {
    return this.session.batch(batch);
  }
};
function drizzle(client, config = {}) {
  const dialect = new SQLiteAsyncDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new SQLiteD1Session(client, dialect, schema, { logger, cache: config.cache });
  const db = new DrizzleD1Database("async", dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
__name(drizzle, "drizzle");

// src/db.ts
init_schema();
var createDb = /* @__PURE__ */ __name((d1) => {
  return drizzle(d1, { schema: schema_exports });
}, "createDb");

// src/routes/auth.ts
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/middleware/jwt/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/middleware/jwt/jwt.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/helper/cookie/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/cookie.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/index.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/jwt.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/encode.js
init_checked_fetch();
init_modules_watch_stub();
var decodeBase64Url = /* @__PURE__ */ __name((str) => {
  return decodeBase64(str.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
}, "decodeBase64Url");
var encodeBase64Url = /* @__PURE__ */ __name((buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m), "encodeBase64Url");
var encodeBase64 = /* @__PURE__ */ __name((buf) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}, "encodeBase64");
var decodeBase64 = /* @__PURE__ */ __name((str) => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
}, "decodeBase64");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/jwa.js
init_checked_fetch();
init_modules_watch_stub();
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  AlgorithmTypes2["RS256"] = "RS256";
  AlgorithmTypes2["RS384"] = "RS384";
  AlgorithmTypes2["RS512"] = "RS512";
  AlgorithmTypes2["PS256"] = "PS256";
  AlgorithmTypes2["PS384"] = "PS384";
  AlgorithmTypes2["PS512"] = "PS512";
  AlgorithmTypes2["ES256"] = "ES256";
  AlgorithmTypes2["ES384"] = "ES384";
  AlgorithmTypes2["ES512"] = "ES512";
  AlgorithmTypes2["EdDSA"] = "EdDSA";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/jws.js
init_checked_fetch();
init_modules_watch_stub();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/helper/adapter/index.js
init_checked_fetch();
init_modules_watch_stub();
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = /* @__PURE__ */ __name(() => {
  const global = globalThis;
  const userAgentSupported = typeof navigator !== "undefined" && true;
  if (userAgentSupported) {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
      if (checkUserAgentEquals(userAgent)) {
        return runtimeKey;
      }
    }
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
}, "getRuntimeKey");
var checkUserAgentEquals = /* @__PURE__ */ __name((platform) => {
  const userAgent = "Cloudflare-Workers";
  return userAgent.startsWith(platform);
}, "checkUserAgentEquals");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/types.js
init_checked_fetch();
init_modules_watch_stub();
var JwtAlgorithmNotImplemented = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotImplemented");
  }
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
};
var JwtAlgorithmRequired = class extends Error {
  static {
    __name(this, "JwtAlgorithmRequired");
  }
  constructor() {
    super('JWT verification requires "alg" option to be specified');
    this.name = "JwtAlgorithmRequired";
  }
};
var JwtAlgorithmMismatch = class extends Error {
  static {
    __name(this, "JwtAlgorithmMismatch");
  }
  constructor(expected, actual) {
    super(`JWT algorithm mismatch: expected "${expected}", got "${actual}"`);
    this.name = "JwtAlgorithmMismatch";
  }
};
var JwtTokenInvalid = class extends Error {
  static {
    __name(this, "JwtTokenInvalid");
  }
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
};
var JwtTokenNotBefore = class extends Error {
  static {
    __name(this, "JwtTokenNotBefore");
  }
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
};
var JwtTokenExpired = class extends Error {
  static {
    __name(this, "JwtTokenExpired");
  }
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
};
var JwtTokenIssuedAt = class extends Error {
  static {
    __name(this, "JwtTokenIssuedAt");
  }
  constructor(currentTimestamp, iat) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    );
    this.name = "JwtTokenIssuedAt";
  }
};
var JwtTokenIssuer = class extends Error {
  static {
    __name(this, "JwtTokenIssuer");
  }
  constructor(expected, iss) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
    this.name = "JwtTokenIssuer";
  }
};
var JwtHeaderInvalid = class extends Error {
  static {
    __name(this, "JwtHeaderInvalid");
  }
  constructor(header) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderInvalid";
  }
};
var JwtHeaderRequiresKid = class extends Error {
  static {
    __name(this, "JwtHeaderRequiresKid");
  }
  constructor(header) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderRequiresKid";
  }
};
var JwtSymmetricAlgorithmNotAllowed = class extends Error {
  static {
    __name(this, "JwtSymmetricAlgorithmNotAllowed");
  }
  constructor(alg) {
    super(`symmetric algorithm "${alg}" is not allowed for JWK verification`);
    this.name = "JwtSymmetricAlgorithmNotAllowed";
  }
};
var JwtAlgorithmNotAllowed = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotAllowed");
  }
  constructor(alg, allowedAlgorithms) {
    super(`algorithm "${alg}" is not in the allowed list: [${allowedAlgorithms.join(", ")}]`);
    this.name = "JwtAlgorithmNotAllowed";
  }
};
var JwtTokenSignatureMismatched = class extends Error {
  static {
    __name(this, "JwtTokenSignatureMismatched");
  }
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
};
var JwtPayloadRequiresAud = class extends Error {
  static {
    __name(this, "JwtPayloadRequiresAud");
  }
  constructor(payload) {
    super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`);
    this.name = "JwtPayloadRequiresAud";
  }
};
var JwtTokenAudience = class extends Error {
  static {
    __name(this, "JwtTokenAudience");
  }
  constructor(expected, aud) {
    super(
      `expected audience "${Array.isArray(expected) ? expected.join(", ") : expected}", got "${aud}"`
    );
    this.name = "JwtTokenAudience";
  }
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Encrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["DeriveKey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/utf8.js
init_checked_fetch();
init_modules_watch_stub();
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
__name(signing, "signing");
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
__name(verifying, "verifying");
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*?-+/g, "").replace(/\s/g, ""));
}
__name(pemToBinary, "pemToBinary");
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPrivateKey, "importPrivateKey");
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPublicKey, "importPublicKey");
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x, y } = jwk;
  return { kty, alg, e, n, crv, x, y, key_ops: [CryptoKeyUsage.Verify] };
}
__name(exportPublicJwkFrom, "exportPublicJwkFrom");
function getKeyAlgorithm(name) {
  switch (name) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
        // 256 >> 3
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
        // 384 >> 3
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
        // 512 >> 3,
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
}
__name(getKeyAlgorithm, "getKeyAlgorithm");
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}
__name(isCryptoKey, "isCryptoKey");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/jwt.js
var encodeJwtPart = /* @__PURE__ */ __name((part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, ""), "encodeJwtPart");
var encodeSignaturePart = /* @__PURE__ */ __name((buf) => encodeBase64Url(buf).replace(/=/g, ""), "encodeSignaturePart");
var decodeJwtPart = /* @__PURE__ */ __name((part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part))), "decodeJwtPart");
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
__name(isTokenHeader, "isTokenHeader");
var sign = /* @__PURE__ */ __name(async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  let encodedHeader;
  if (typeof privateKey === "object" && "alg" in privateKey) {
    alg = privateKey.alg;
    encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
  } else {
    encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  }
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
}, "sign");
var verify = /* @__PURE__ */ __name(async (token, publicKey, algOrOptions) => {
  if (!algOrOptions) {
    throw new JwtAlgorithmRequired();
  }
  const {
    alg,
    iss,
    nbf = true,
    exp = true,
    iat = true,
    aud
  } = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions;
  if (!alg) {
    throw new JwtAlgorithmRequired();
  }
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (header.alg !== alg) {
    throw new JwtAlgorithmMismatch(alg, header.alg);
  }
  const now = Math.floor(Date.now() / 1e3);
  if (nbf && payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number" || !Number.isFinite(payload.nbf) || payload.nbf > now) {
      throw new JwtTokenNotBefore(token);
    }
  }
  if (exp && payload.exp !== void 0) {
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= now) {
      throw new JwtTokenExpired(token);
    }
  }
  if (iat && payload.iat !== void 0) {
    if (typeof payload.iat !== "number" || !Number.isFinite(payload.iat) || now < payload.iat) {
      throw new JwtTokenIssuedAt(now, payload.iat);
    }
  }
  if (iss) {
    if (!payload.iss) {
      throw new JwtTokenIssuer(iss, null);
    }
    if (typeof iss === "string" && payload.iss !== iss) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
    if (iss instanceof RegExp && !iss.test(payload.iss)) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
  }
  if (aud) {
    if (!payload.aud) {
      throw new JwtPayloadRequiresAud(payload);
    }
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const matched = audiences.some(
      (payloadAud) => aud instanceof RegExp ? aud.test(payloadAud) : typeof aud === "string" ? payloadAud === aud : Array.isArray(aud) && aud.includes(payloadAud)
    );
    if (!matched) {
      throw new JwtTokenAudience(aud, payload.aud);
    }
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await verifying(
    publicKey,
    alg,
    decodeBase64Url(tokenParts[2]),
    utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
}, "verify");
var symmetricAlgorithms = [
  AlgorithmTypes.HS256,
  AlgorithmTypes.HS384,
  AlgorithmTypes.HS512
];
var verifyWithJwks = /* @__PURE__ */ __name(async (token, options, init) => {
  const verifyOpts = options.verification || {};
  const header = decodeHeader(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (!header.kid) {
    throw new JwtHeaderRequiresKid(header);
  }
  if (symmetricAlgorithms.includes(header.alg)) {
    throw new JwtSymmetricAlgorithmNotAllowed(header.alg);
  }
  if (!options.allowedAlgorithms.includes(header.alg)) {
    throw new JwtAlgorithmNotAllowed(header.alg, options.allowedAlgorithms);
  }
  let verifyKeys = options.keys ? [...options.keys] : void 0;
  if (options.jwks_uri) {
    const response = await fetch(options.jwks_uri, init);
    if (!response.ok) {
      throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
    }
    const data = await response.json();
    if (!data.keys) {
      throw new Error('invalid JWKS response. "keys" field is missing');
    }
    if (!Array.isArray(data.keys)) {
      throw new Error('invalid JWKS response. "keys" field is not an array');
    }
    verifyKeys ??= [];
    verifyKeys.push(...data.keys);
  } else if (!verifyKeys) {
    throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  }
  const matchingKey = verifyKeys.find((key) => key.kid === header.kid);
  if (!matchingKey) {
    throw new JwtTokenInvalid(token);
  }
  if (matchingKey.alg && matchingKey.alg !== header.alg) {
    throw new JwtAlgorithmMismatch(matchingKey.alg, header.alg);
  }
  return await verify(token, matchingKey, {
    alg: header.alg,
    ...verifyOpts
  });
}, "verifyWithJwks");
var decode = /* @__PURE__ */ __name((token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  try {
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);
    return {
      header,
      payload
    };
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decode");
var decodeHeader = /* @__PURE__ */ __name((token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  try {
    return decodeJwtPart(parts[0]);
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decodeHeader");

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/utils/jwt/index.js
var Jwt = { sign, verify, decode, verifyWithJwks };

// ../../node_modules/.pnpm/hono@4.13.1/node_modules/hono/dist/middleware/jwt/jwt.js
var verifyWithJwks2 = Jwt.verifyWithJwks;
var verify2 = Jwt.verify;
var decode2 = Jwt.decode;
var sign2 = Jwt.sign;

// src/routes/auth.ts
init_schema();

// src/middleware/jwt.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
async function jwtMiddleware(c, next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, error: "Missing or invalid Authorization header" }, 401);
  }
  const token = authHeader.split(" ")[1];
  const secret = "super_secret_jwt_key_replace_me_in_prod";
  try {
    const payload = await verify2(token, secret, "HS256");
    const db = c.get("db");
    const user = await db.select().from(users).where(eq(users.id, payload.id)).get();
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 401);
    }
    if (user.status !== "ACTIVE") {
      return c.json({ success: false, error: "Account is not active" }, 403);
    }
    c.set("user", user);
    c.set("jwtPayload", payload);
    await next();
  } catch (error) {
    return c.json({ success: false, error: "Invalid or expired token" }, 401);
  }
}
__name(jwtMiddleware, "jwtMiddleware");

// src/routes/auth.ts
var authRoutes = new Hono2();
var JWT_SECRET = "super_secret_jwt_key_replace_me_in_prod";
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword, "hashPassword");
authRoutes.post("/register", async (c) => {
  const body = await c.req.json();
  const db = c.get("db");
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, body.email)).get();
    if (existingUser) {
      return c.json({ success: false, error: "Email already in use" }, 400);
    }
    const hashedPassword = await hashPassword(body.password);
    const userId = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    const now = /* @__PURE__ */ new Date();
    await db.insert(users).values({
      id: userId,
      email: body.email,
      passwordHash: hashedPassword,
      createdAt: now,
      updatedAt: now,
      role: "USER",
      status: "ACTIVE"
    });
    await db.insert(sessions).values({
      id: sessionId,
      userId,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1e3),
      // 1 day
      userAgent: c.req.header("user-agent") || "Unknown",
      ipAddress: c.req.header("x-real-ip") || c.req.header("x-forwarded-for") || "Unknown",
      createdAt: now
    });
    const initialPaperFunds = [
      { assetSymbol: "USDT", amount: "100000" },
      { assetSymbol: "BTC", amount: "10" },
      { assetSymbol: "ETH", amount: "100" }
    ];
    for (const fund of initialPaperFunds) {
      await db.insert(wallets).values({
        id: crypto.randomUUID(),
        userId,
        assetSymbol: fund.assetSymbol,
        type: "PAPER",
        balance: fund.amount,
        lockedBalance: "0",
        createdAt: now,
        updatedAt: now
      });
    }
    const token = await sign2({ id: userId, email: body.email, sessionId, exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 }, JWT_SECRET);
    const user = await db.select().from(users).where(eq(users.id, userId)).get();
    return c.json({ success: true, token, data: { user } });
  } catch (err) {
    return c.json({ success: false, error: err.message, stack: err.stack }, 500);
  }
});
authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const db = c.get("db");
  const user = await db.select().from(users).where(eq(users.email, body.email)).get();
  if (!user) {
    return c.json({ success: false, error: "Invalid credentials" }, 401);
  }
  const hashedPassword = await hashPassword(body.password);
  if (user.passwordHash !== hashedPassword) {
    return c.json({ success: false, error: "Invalid credentials" }, 401);
  }
  const sessionId = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date();
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1e3),
    // 1 day
    userAgent: c.req.header("user-agent") || "Unknown",
    ipAddress: c.req.header("x-real-ip") || c.req.header("x-forwarded-for") || "Unknown",
    createdAt: now
  });
  await db.update(users).set({ lastLoginAt: now }).where(eq(users.id, user.id));
  const token = await sign2({ id: user.id, email: user.email, sessionId, exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 }, JWT_SECRET);
  return c.json({ success: true, token, data: { user } });
});
authRoutes.get("/me", jwtMiddleware, async (c) => {
  const user = c.get("user");
  return c.json({ success: true, data: user });
});
authRoutes.post("/profile/update", jwtMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get("user");
  const db = c.get("db");
  const now = /* @__PURE__ */ new Date();
  await db.update(users).set({
    displayName: body.displayName,
    firstName: body.firstName,
    lastName: body.lastName,
    updatedAt: now
  }).where(eq(users.id, user.id));
  const updatedUser = await db.select().from(users).where(eq(users.id, user.id)).get();
  return c.json({ success: true, data: updatedUser });
});
authRoutes.get("/sessions", jwtMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.get("db");
  const activeSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id)).all();
  const jwtPayload = c.get("jwtPayload");
  const currentSessionId = jwtPayload?.sessionId;
  const mappedSessions = activeSessions.map((s) => ({
    id: s.id,
    device: s.userAgent?.includes("Mobile") ? "Mobile" : "Desktop",
    browser: s.userAgent?.split(" ")[0] || "Unknown Browser",
    os: s.userAgent?.split(" ")[1] || "Unknown OS",
    lastActiveAt: s.createdAt,
    isCurrentSession: s.id === currentSessionId
  }));
  return c.json({ success: true, data: mappedSessions });
});
authRoutes.post("/sessions/revoke", jwtMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get("user");
  const db = c.get("db");
  await db.delete(sessions).where(and(eq(sessions.id, body.sessionId), eq(sessions.userId, user.id)));
  return c.json({ success: true });
});
authRoutes.post("/sessions/revoke-all", jwtMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.get("db");
  const jwtPayload = c.get("jwtPayload");
  const currentSessionId = jwtPayload?.sessionId;
  if (currentSessionId) {
    const allSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id)).all();
    for (const s of allSessions) {
      if (s.id !== currentSessionId) {
        await db.delete(sessions).where(eq(sessions.id, s.id));
      }
    }
  }
  return c.json({ success: true });
});

// src/routes/wallets.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
var walletRoutes = new Hono2();
walletRoutes.use("*", jwtMiddleware);
var getMockPrice = /* @__PURE__ */ __name((symbol) => {
  const prices = {
    "BTC-USD": 104250,
    "ETH-USD": 3500,
    "SOL-USD": 140,
    "BTC": 104250,
    "ETH": 3500,
    "SOL": 140,
    "USDT": 1,
    "USDC": 1,
    "USD": 1
  };
  return prices[symbol] || 0;
}, "getMockPrice");
walletRoutes.post("/top-up-paper", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const assetSymbol = "USDT";
  const amount = "100000";
  const now = /* @__PURE__ */ new Date();
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, "PAPER"))).get();
  if (!wallet) {
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      userId: user.id,
      assetSymbol,
      type: "PAPER",
      balance: amount,
      lockedBalance: "0",
      createdAt: now,
      updatedAt: now
    });
  } else {
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }
  await db.insert(walletTransactions).values({
    id: `TX-PAPER-${Date.now()}`,
    userId: user.id,
    type: "DEPOSIT",
    mode: "PAPER",
    assetSymbol,
    amount,
    status: "COMPLETED",
    network: "System",
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true });
});
walletRoutes.get("/balances", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const mode = c.req.query("mode") || c.req.header("x-trading-mode") || "REAL";
  const userWallets = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.type, mode))).all();
  const formattedBalances = userWallets.map((w) => {
    const available = parseFloat(w.balance);
    const locked = parseFloat(w.lockedBalance);
    const total = available + locked;
    const usdPrice = getMockPrice(w.assetSymbol);
    return {
      assetId: w.assetSymbol.toLowerCase(),
      symbol: w.assetSymbol,
      available,
      locked,
      total,
      usdPrice,
      usdValue: total * usdPrice,
      change24h: 0,
      // Mocked for now
      change24hPercent: 0
      // Mocked for now
    };
  });
  return c.json({ success: true, data: formattedBalances });
});
walletRoutes.get("/portfolio", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const mode = c.req.query("mode") || c.req.header("x-trading-mode") || "REAL";
  const userWallets = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.type, mode))).all();
  let totalValueUsd = 0;
  let availableBalanceUsd = 0;
  let lockedBalanceUsd = 0;
  const allocations = userWallets.map((w) => {
    const total = parseFloat(w.balance) + parseFloat(w.lockedBalance);
    const usdValue = total * getMockPrice(w.assetSymbol);
    totalValueUsd += usdValue;
    availableBalanceUsd += parseFloat(w.balance) * getMockPrice(w.assetSymbol);
    lockedBalanceUsd += parseFloat(w.lockedBalance) * getMockPrice(w.assetSymbol);
    return {
      asset: w.assetSymbol,
      usdValue,
      percentage: 0
      // Will calculate below
    };
  });
  const finalAllocations = allocations.map((a) => ({
    ...a,
    percentage: totalValueUsd > 0 ? a.usdValue / totalValueUsd * 100 : 0
  })).filter((a) => a.percentage > 0).sort((a, b) => b.usdValue - a.usdValue);
  const summary = {
    totalValueUsd,
    change24hUsd: 0,
    change24hPercent: 0,
    availableBalanceUsd,
    lockedBalanceUsd
  };
  return c.json({ success: true, data: { summary, allocations: finalAllocations } });
});
walletRoutes.get("/transactions", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const mode = c.req.query("mode") || c.req.header("x-trading-mode") || "REAL";
  const transactions = await db.select().from(walletTransactions).where(and(eq(walletTransactions.userId, user.id), eq(walletTransactions.mode, mode))).orderBy(desc(walletTransactions.createdAt)).all();
  const mappedTxs = transactions.map((tx) => ({
    id: tx.id,
    type: tx.type,
    asset: tx.assetSymbol,
    amount: parseFloat(tx.amount),
    fee: parseFloat(tx.fee),
    status: tx.status,
    destination: tx.destination,
    network: tx.network,
    reference: tx.reference,
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString()
  }));
  return c.json({ success: true, data: mappedTxs });
});
walletRoutes.post("/deposit", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const { assetSymbol, amount, network, destination, mode = "REAL" } = body;
  const transactionId = `TX-${Date.now()}`;
  const now = /* @__PURE__ */ new Date();
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, mode))).get();
  if (!wallet) {
    const walletId = crypto.randomUUID();
    await db.insert(wallets).values({
      id: walletId,
      userId: user.id,
      assetSymbol,
      type: mode,
      balance: amount.toString(),
      lockedBalance: "0",
      createdAt: now,
      updatedAt: now
    });
  } else {
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }
  await db.insert(walletTransactions).values({
    id: transactionId,
    userId: user.id,
    type: "DEPOSIT",
    mode,
    assetSymbol,
    amount: amount.toString(),
    status: "COMPLETED",
    // Simulated paper trading completes instantly
    network: network || "Internal",
    destination,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, transactionId });
});
walletRoutes.post("/withdraw", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const { assetSymbol, amount, destination, network, mode = "REAL" } = body;
  const parsedAmount = parseFloat(amount);
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, mode))).get();
  if (!wallet || parseFloat(wallet.balance) < parsedAmount) {
    return c.json({ success: false, error: "Insufficient balance" }, 400);
  }
  const now = /* @__PURE__ */ new Date();
  const transactionId = `TX-${Date.now()}`;
  const newBalance = (parseFloat(wallet.balance) - parsedAmount).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  await db.insert(walletTransactions).values({
    id: transactionId,
    userId: user.id,
    type: "WITHDRAWAL",
    mode,
    assetSymbol,
    amount: amount.toString(),
    status: "COMPLETED",
    // Simulated paper trading completes instantly
    destination,
    network: network || "Internal",
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, transactionId });
});

// src/routes/trading.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
var tradingRoutes = new Hono2();
var getMockPrice2 = /* @__PURE__ */ __name((symbol) => {
  const prices = {
    "BTC-USDT": 104250,
    "ETH-USDT": 3500,
    "SOL-USDT": 140
  };
  return prices[symbol] || 0;
}, "getMockPrice");
var DEFAULT_MARKETS = [
  { symbol: "BTC-USDT", baseAsset: "BTC", quoteAsset: "USDT", minPrice: "1", maxPrice: "1000000", tickSize: "0.01", minAmount: "0.00001", stepSize: "0.00001", makerFee: "0.001", takerFee: "0.001" },
  { symbol: "ETH-USDT", baseAsset: "ETH", quoteAsset: "USDT", minPrice: "1", maxPrice: "100000", tickSize: "0.01", minAmount: "0.001", stepSize: "0.001", makerFee: "0.001", takerFee: "0.001" },
  { symbol: "SOL-USDT", baseAsset: "SOL", quoteAsset: "USDT", minPrice: "0.1", maxPrice: "1000", tickSize: "0.01", minAmount: "0.1", stepSize: "0.1", makerFee: "0.001", takerFee: "0.001" }
];
tradingRoutes.get("/markets", async (c) => {
  const db = c.get("db");
  let allMarkets = await db.select().from(markets).all();
  if (allMarkets.length === 0) {
    const now = /* @__PURE__ */ new Date();
    await db.insert(markets).values(DEFAULT_MARKETS.map((m) => ({
      id: crypto.randomUUID(),
      ...m,
      createdAt: now
    })));
    allMarkets = await db.select().from(markets).all();
  }
  const formattedMarkets = allMarkets.map((m) => {
    const currentPrice = getMockPrice2(m.symbol);
    return {
      id: m.symbol,
      symbol: m.symbol,
      name: m.symbol,
      baseAsset: m.baseAsset,
      quoteAsset: m.quoteAsset,
      price: currentPrice,
      priceChange24h: 0,
      high24h: currentPrice * 1.02,
      low24h: currentPrice * 0.98,
      volume24h: 1e6,
      sparkline: [currentPrice, currentPrice * 1.01, currentPrice * 0.99, currentPrice],
      isNew: false
    };
  });
  return c.json({ success: true, data: formattedMarkets });
});
tradingRoutes.get("/markets/:symbol/candles", async (c) => {
  const symbol = c.req.param("symbol");
  const currentPrice = getMockPrice2(symbol) || 1e5;
  const candles = [];
  let price = currentPrice * 0.95;
  const now = Date.now();
  for (let i = 100; i >= 0; i--) {
    const isUp = Math.random() > 0.5;
    const change = price * (Math.random() * 5e-3);
    const open = price;
    const close = isUp ? price + change : price - change;
    const high = Math.max(open, close) + price * (Math.random() * 2e-3);
    const low = Math.min(open, close) - price * (Math.random() * 2e-3);
    candles.push({
      time: (now - i * 15 * 60 * 1e3) / 1e3,
      // 15m intervals unix
      open,
      high,
      low,
      close,
      volume: Math.random() * 100
    });
    price = close;
  }
  candles[candles.length - 1].close = currentPrice;
  return c.json({ success: true, data: candles });
});
tradingRoutes.get("/markets/:symbol/orderbook", async (c) => {
  const symbol = c.req.param("symbol");
  const currentPrice = getMockPrice2(symbol) || 1e5;
  const asks = [];
  const bids = [];
  let currentAsk = currentPrice * 1.0001;
  let currentBid = currentPrice * 0.9999;
  for (let i = 0; i < 20; i++) {
    const askAmount = Math.random() * 2 + 0.1;
    asks.push({ price: currentAsk, amount: askAmount, total: currentAsk * askAmount });
    currentAsk *= 1 + Math.random() * 1e-3;
    const bidAmount = Math.random() * 2 + 0.1;
    bids.push({ price: currentBid, amount: bidAmount, total: currentBid * bidAmount });
    currentBid *= 1 - Math.random() * 1e-3;
  }
  return c.json({ success: true, data: { asks: asks.reverse(), bids } });
});
tradingRoutes.get("/markets/:symbol/trades", async (c) => {
  const symbol = c.req.param("symbol");
  const currentPrice = getMockPrice2(symbol) || 1e5;
  const trades2 = [];
  for (let i = 0; i < 30; i++) {
    trades2.push({
      id: Math.random().toString(),
      price: currentPrice * (1 + (Math.random() * 2e-3 - 1e-3)),
      amount: Math.random() * 1.5 + 0.01,
      time: new Date(Date.now() - Math.random() * 6e5).toLocaleTimeString(),
      isBuyerMaker: Math.random() > 0.5
    });
  }
  const sortedTrades = trades2.sort((a, b) => b.time.localeCompare(a.time));
  return c.json({ success: true, data: sortedTrades });
});
tradingRoutes.use("*", jwtMiddleware);
tradingRoutes.get("/orders", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const mode = c.req.header("x-trading-mode") || "REAL";
  const userOrders = await db.select().from(orders).where(and(eq(orders.userId, user.id), eq(orders.mode, mode))).orderBy(desc(orders.createdAt)).all();
  const formattedOrders = userOrders.map((o) => ({
    id: o.id,
    market: o.marketSymbol,
    side: o.side,
    type: o.type,
    price: o.price ? parseFloat(o.price) : void 0,
    amount: parseFloat(o.amount),
    filled: parseFloat(o.filledAmount),
    total: o.price ? parseFloat(o.amount) * parseFloat(o.price) : void 0,
    status: o.status,
    createdAt: o.createdAt.toISOString()
  }));
  return c.json({ success: true, data: formattedOrders });
});
tradingRoutes.get("/trades", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const mode = c.req.header("x-trading-mode") || "REAL";
  const userOrders = await db.select().from(orders).where(and(eq(orders.userId, user.id), eq(orders.mode, mode))).all();
  const orderIds = userOrders.map((o) => o.id);
  if (orderIds.length === 0) {
    return c.json({ success: true, data: [] });
  }
  const allTrades = await db.select().from(trades).orderBy(desc(trades.createdAt)).all();
  const userTrades = allTrades.filter((t) => orderIds.includes(t.makerOrderId) || orderIds.includes(t.takerOrderId));
  const formattedTrades = userTrades.map((t) => {
    const userOrder = userOrders.find((o) => o.id === t.makerOrderId || o.id === t.takerOrderId);
    return {
      id: t.id,
      market: t.marketSymbol,
      side: userOrder?.side || "BUY",
      price: parseFloat(t.price),
      amount: parseFloat(t.amount),
      total: parseFloat(t.price) * parseFloat(t.amount),
      fee: userOrder?.id === t.makerOrderId ? parseFloat(t.makerFee) : parseFloat(t.takerFee),
      feeAsset: userOrder?.side === "BUY" ? t.marketSymbol.split("-")[0] : t.marketSymbol.split("-")[1],
      // Simplified
      createdAt: t.createdAt.toISOString()
    };
  });
  return c.json({ success: true, data: formattedTrades });
});
tradingRoutes.post("/orders", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const mode = c.req.header("x-trading-mode") || "REAL";
  const { market, side, type, amount, price } = body;
  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, market)).get();
  if (!marketInfo) {
    return c.json({ success: false, error: "Market not found" }, 400);
  }
  const orderPrice = type === "MARKET" ? getMockPrice2(market) : parseFloat(price);
  if (orderPrice <= 0) {
    return c.json({ success: false, error: "Invalid price" }, 400);
  }
  const parsedAmount = parseFloat(amount);
  const totalValue = parsedAmount * orderPrice;
  const spendAsset = side === "BUY" ? marketInfo.quoteAsset : marketInfo.baseAsset;
  const receiveAsset = side === "BUY" ? marketInfo.baseAsset : marketInfo.quoteAsset;
  const spendAmount = side === "BUY" ? totalValue : parsedAmount;
  let spendWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, spendAsset), eq(wallets.type, mode))).get();
  if (!spendWallet || parseFloat(spendWallet.balance) < spendAmount) {
    return c.json({ success: false, error: "Insufficient balance" }, 400);
  }
  const now = /* @__PURE__ */ new Date();
  const orderId = `ORD-${Date.now()}`;
  const newSpendBalance = (parseFloat(spendWallet.balance) - spendAmount).toString();
  const newLockedBalance = (parseFloat(spendWallet.lockedBalance) + spendAmount).toString();
  await db.update(wallets).set({ balance: newSpendBalance, lockedBalance: newLockedBalance, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
  const orderStatus = type === "MARKET" ? "FILLED" : "OPEN";
  const filledAmount = type === "MARKET" ? amount.toString() : "0";
  const remainingAmount = type === "MARKET" ? "0" : amount.toString();
  await db.insert(orders).values({
    id: orderId,
    userId: user.id,
    marketSymbol: market,
    mode,
    side,
    type,
    price: type === "LIMIT" ? price.toString() : orderPrice.toString(),
    amount: amount.toString(),
    filledAmount,
    remainingAmount,
    status: orderStatus,
    createdAt: now,
    updatedAt: now
  });
  if (type === "MARKET") {
    const tradeId = `TRD-${Date.now()}`;
    await db.insert(trades).values({
      id: tradeId,
      marketSymbol: market,
      mode,
      makerOrderId: "mock-maker-order",
      takerOrderId: orderId,
      price: orderPrice.toString(),
      amount: amount.toString(),
      makerFee: "0",
      takerFee: (spendAmount * parseFloat(marketInfo.takerFee)).toString(),
      createdAt: now
    });
    const finalSpendWallet = await db.select().from(wallets).where(eq(wallets.id, spendWallet.id)).get();
    if (finalSpendWallet) {
      const finalLocked = (parseFloat(finalSpendWallet.lockedBalance) - spendAmount).toString();
      await db.update(wallets).set({ lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
    }
    const feeAmount = side === "BUY" ? parsedAmount * parseFloat(marketInfo.takerFee) : totalValue * parseFloat(marketInfo.takerFee);
    const receiveAmountFinal = (side === "BUY" ? parsedAmount : totalValue) - feeAmount;
    let receiveWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, receiveAsset), eq(wallets.type, mode))).get();
    if (!receiveWallet) {
      const walletId = crypto.randomUUID();
      await db.insert(wallets).values({
        id: walletId,
        userId: user.id,
        assetSymbol: receiveAsset,
        type: mode,
        balance: receiveAmountFinal.toString(),
        lockedBalance: "0",
        createdAt: now,
        updatedAt: now
      });
    } else {
      const newReceiveBalance = (parseFloat(receiveWallet.balance) + receiveAmountFinal).toString();
      await db.update(wallets).set({ balance: newReceiveBalance, updatedAt: now }).where(eq(wallets.id, receiveWallet.id));
    }
  }
  return c.json({ success: true, orderId });
});
tradingRoutes.delete("/orders/:id", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const order = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, user.id))).get();
  if (!order) {
    return c.json({ success: false, error: "Order not found" }, 404);
  }
  if (order.status !== "OPEN") {
    return c.json({ success: false, error: "Order cannot be canceled" }, 400);
  }
  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, order.marketSymbol)).get();
  if (!marketInfo) return c.json({ success: false, error: "Market missing" }, 400);
  const now = /* @__PURE__ */ new Date();
  await db.update(orders).set({ status: "CANCELED", updatedAt: now }).where(eq(orders.id, order.id));
  const remainingValue = parseFloat(order.remainingAmount) * parseFloat(order.price || "0");
  const refundAsset = order.side === "BUY" ? marketInfo.quoteAsset : marketInfo.baseAsset;
  const refundAmount = order.side === "BUY" ? remainingValue : parseFloat(order.remainingAmount);
  let refundWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, refundAsset), eq(wallets.type, order.mode))).get();
  if (refundWallet) {
    const newBalance = (parseFloat(refundWallet.balance) + refundAmount).toString();
    const newLocked = (parseFloat(refundWallet.lockedBalance) - refundAmount).toString();
    await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, refundWallet.id));
  }
  return c.json({ success: true });
});

// src/routes/p2p.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
var p2pRoutes = new Hono2();
var DEFAULT_P2P_ADS = [
  { id: "ad-1", type: "SELL", asset: "USDT", fiat: "USD", price: "1.02", totalAmount: "1000", availableAmount: "1000", minLimit: "50", maxLimit: "1000", paymentMethods: JSON.stringify(["Bank Transfer"]), status: "ACTIVE" },
  { id: "ad-2", type: "BUY", asset: "USDT", fiat: "USD", price: "0.98", totalAmount: "5000", availableAmount: "5000", minLimit: "100", maxLimit: "5000", paymentMethods: JSON.stringify(["Zelle", "PayPal"]), status: "ACTIVE" },
  { id: "ad-3", type: "SELL", asset: "BTC", fiat: "USD", price: "105000", totalAmount: "0.5", availableAmount: "0.5", minLimit: "500", maxLimit: "50000", paymentMethods: JSON.stringify(["Bank Transfer", "Wire"]), status: "ACTIVE" }
];
p2pRoutes.get("/ads", async (c) => {
  const db = c.get("db");
  let adsWithUsers = await db.select({
    ad: p2pAds,
    user: users
  }).from(p2pAds).leftJoin(users, eq(p2pAds.userId, users.id)).where(eq(p2pAds.status, "ACTIVE")).orderBy(desc(p2pAds.createdAt)).all();
  if (adsWithUsers.length === 0) {
    const now = /* @__PURE__ */ new Date();
    const dummyUserId = "system-user-id";
    await db.insert(p2pAds).values(DEFAULT_P2P_ADS.map((ad) => ({
      ...ad,
      userId: dummyUserId,
      createdAt: now,
      updatedAt: now
    })));
    adsWithUsers = await db.select({ ad: p2pAds, user: users }).from(p2pAds).leftJoin(users, eq(p2pAds.userId, users.id)).where(eq(p2pAds.status, "ACTIVE")).orderBy(desc(p2pAds.createdAt)).all();
  }
  const formattedAds = adsWithUsers.map(({ ad, user }) => {
    return {
      ...ad,
      paymentMethods: JSON.parse(ad.paymentMethods),
      merchant: {
        id: ad.userId,
        displayName: user?.displayName || `User_${ad.userId.substring(0, 4)}`,
        username: user?.email ? user.email.split("@")[0] : `user_${ad.userId.substring(0, 4)}`,
        verified: user?.status === "ACTIVE",
        completionRate: 98,
        totalOrders: 150,
        averageReleaseTime: 5,
        online: true,
        positiveFeedback: 148,
        negativeFeedback: 2,
        joinedAt: user?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        supportedPaymentMethods: ["Bank Transfer"]
        // mocked for now until merchant profile table is built
      }
    };
  });
  return c.json({ success: true, data: formattedAds });
});
p2pRoutes.use("*", jwtMiddleware);
p2pRoutes.post("/ads", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const { type, asset, fiat, price, totalAmount, minLimit, maxLimit, paymentMethods, terms } = body;
  const amountNum = parseFloat(totalAmount);
  if (type === "SELL") {
    let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, asset))).get();
    if (!wallet || parseFloat(wallet.balance) < amountNum) {
      return c.json({ success: false, error: "Insufficient crypto balance to create this ad." }, 400);
    }
    const newBalance = (parseFloat(wallet.balance) - amountNum).toString();
    const newLocked = (parseFloat(wallet.lockedBalance) + amountNum).toString();
    const now2 = /* @__PURE__ */ new Date();
    await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now2 }).where(eq(wallets.id, wallet.id));
  }
  const now = /* @__PURE__ */ new Date();
  const adId = `AD-${Date.now()}`;
  await db.insert(p2pAds).values({
    id: adId,
    userId: user.id,
    type,
    asset,
    fiat,
    price: price.toString(),
    totalAmount: totalAmount.toString(),
    availableAmount: totalAmount.toString(),
    minLimit: minLimit.toString(),
    maxLimit: maxLimit.toString(),
    paymentMethods: JSON.stringify(paymentMethods),
    terms: terms || "",
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, adId });
});
p2pRoutes.get("/orders", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const userOrders = await db.select().from(p2pOrders).where(or(eq(p2pOrders.buyerId, user.id), eq(p2pOrders.sellerId, user.id))).orderBy(desc(p2pOrders.createdAt)).all();
  return c.json({ success: true, data: userOrders });
});
p2pRoutes.post("/orders", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const { adId, cryptoAmount, fiatAmount, paymentMethod } = body;
  const ad = await db.select().from(p2pAds).where(eq(p2pAds.id, adId)).get();
  if (!ad || ad.status !== "ACTIVE") {
    return c.json({ success: false, error: "Ad is no longer active." }, 400);
  }
  if (user.id === ad.userId) {
    return c.json({ success: false, error: "Cannot take your own ad." }, 400);
  }
  const cryptoNum = parseFloat(cryptoAmount);
  if (parseFloat(ad.availableAmount) < cryptoNum) {
    return c.json({ success: false, error: "Not enough crypto available in this ad." }, 400);
  }
  const buyerId = ad.type === "SELL" ? user.id : ad.userId;
  const sellerId = ad.type === "SELL" ? ad.userId : user.id;
  const now = /* @__PURE__ */ new Date();
  if (ad.type === "BUY") {
    let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, ad.asset))).get();
    if (!wallet || parseFloat(wallet.balance) < cryptoNum) {
      return c.json({ success: false, error: "Insufficient crypto balance to fulfill this order." }, 400);
    }
    const newBalance = (parseFloat(wallet.balance) - cryptoNum).toString();
    const newLocked = (parseFloat(wallet.lockedBalance) + cryptoNum).toString();
    await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }
  const newAvailable = (parseFloat(ad.availableAmount) - cryptoNum).toString();
  await db.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));
  const orderId = `P2P-ORD-${Date.now()}`;
  const expiresAt = new Date(now.getTime() + 15 * 6e4);
  await db.insert(p2pOrders).values({
    id: orderId,
    adId,
    buyerId,
    sellerId,
    cryptoAmount: cryptoAmount.toString(),
    fiatAmount: fiatAmount.toString(),
    price: ad.price,
    status: "PENDING",
    paymentMethod,
    expiresAt,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, orderId });
});
p2pRoutes.get("/orders/:id", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order) return c.json({ success: false, error: "Order not found." }, 404);
  if (order.buyerId !== user.id && order.sellerId !== user.id) {
    return c.json({ success: false, error: "Unauthorized." }, 403);
  }
  return c.json({ success: true, data: order });
});
p2pRoutes.get("/orders/:id/messages", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.buyerId !== user.id && order.sellerId !== user.id) {
    return c.json({ success: false, error: "Unauthorized" }, 403);
  }
  const msgs = await db.select().from(p2pMessages).where(eq(p2pMessages.orderId, orderId)).orderBy(p2pMessages.createdAt).all();
  return c.json({ success: true, data: msgs });
});
p2pRoutes.post("/orders/:id/messages", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const body = await c.req.json();
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.buyerId !== user.id && order.sellerId !== user.id) {
    return c.json({ success: false, error: "Unauthorized" }, 403);
  }
  const msgId = `msg_${Date.now()}`;
  await db.insert(p2pMessages).values({
    id: msgId,
    orderId,
    senderId: user.id,
    content: body.content,
    createdAt: /* @__PURE__ */ new Date()
  });
  return c.json({ success: true, messageId: msgId });
});
p2pRoutes.post("/orders/:id/pay", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.status !== "PENDING") return c.json({ success: false, error: "Invalid order state." }, 400);
  if (order.buyerId !== user.id) return c.json({ success: false, error: "Only buyer can mark as paid." }, 403);
  await db.update(p2pOrders).set({ status: "PAID", updatedAt: /* @__PURE__ */ new Date() }).where(eq(p2pOrders.id, order.id));
  return c.json({ success: true });
});
p2pRoutes.post("/orders/:id/release", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.status !== "PAID") return c.json({ success: false, error: "Order must be PAID to release." }, 400);
  if (order.sellerId !== user.id) return c.json({ success: false, error: "Only seller can release." }, 403);
  const ad = await db.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
  if (!ad) return c.json({ success: false, error: "Ad not found" }, 400);
  const now = /* @__PURE__ */ new Date();
  const cryptoNum = parseFloat(order.cryptoAmount);
  const sellerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
  if (sellerWallet) {
    const finalLocked = (parseFloat(sellerWallet.lockedBalance) - cryptoNum).toString();
    await db.update(wallets).set({ lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
  }
  const buyerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.buyerId), eq(wallets.assetSymbol, ad.asset))).get();
  if (buyerWallet) {
    const finalBalance = (parseFloat(buyerWallet.balance) + cryptoNum).toString();
    await db.update(wallets).set({ balance: finalBalance, updatedAt: now }).where(eq(wallets.id, buyerWallet.id));
  } else {
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      userId: order.buyerId,
      assetSymbol: ad.asset,
      balance: cryptoNum.toString(),
      lockedBalance: "0",
      createdAt: now,
      updatedAt: now
    });
  }
  await db.update(p2pOrders).set({ status: "RELEASED", updatedAt: now }).where(eq(p2pOrders.id, order.id));
  return c.json({ success: true });
});
p2pRoutes.post("/orders/:id/cancel", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const orderId = c.req.param("id");
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || !["PENDING", "PAID"].includes(order.status)) return c.json({ success: false, error: "Cannot cancel this order." }, 400);
  const ad = await db.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
  if (!ad) return c.json({ success: false, error: "Ad not found" }, 400);
  const now = /* @__PURE__ */ new Date();
  const cryptoNum = parseFloat(order.cryptoAmount);
  const sellerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
  if (sellerWallet) {
    const finalBalance = (parseFloat(sellerWallet.balance) + cryptoNum).toString();
    const finalLocked = (parseFloat(sellerWallet.lockedBalance) - cryptoNum).toString();
    await db.update(wallets).set({ balance: finalBalance, lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
  }
  const newAvailable = (parseFloat(ad.availableAmount) + cryptoNum).toString();
  await db.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));
  await db.update(p2pOrders).set({ status: "CANCELLED", updatedAt: now }).where(eq(p2pOrders.id, order.id));
  return c.json({ success: true });
});

// src/routes/admin.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
var adminRoutes = new Hono2();
adminRoutes.use("*", jwtMiddleware);
adminRoutes.use("*", async (c, next) => {
  const user = c.get("user");
  if (!["SUPER_ADMIN", "COMPLIANCE_ADMIN", "SUPPORT_ADMIN", "ADMIN"].includes(user.role)) {
    return c.json({ success: false, error: "Unauthorized: Admin access required" }, 403);
  }
  await next();
});
adminRoutes.get("/stats", async (c) => {
  const db = c.get("db");
  try {
    const allUsers = await db.select().from(users).all();
    const allPendingKyc = await db.select().from(kycProfiles).where(eq(kycProfiles.status, "PENDING")).all();
    const activeMarkets = await db.select().from(markets).where(eq(markets.status, "ACTIVE")).all();
    const totalVolumeUsd = 125e4;
    return c.json({
      success: true,
      data: {
        totalUsers: allUsers.length,
        pendingKyc: allPendingKyc.length,
        activeMarkets: activeMarkets.length,
        totalVolumeUsd
      }
    });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch admin stats" }, 500);
  }
});
adminRoutes.get("/users", async (c) => {
  const db = c.get("db");
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt
    }).from(users).orderBy(desc(users.createdAt)).all();
    return c.json({ success: true, data: allUsers });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch users" }, 500);
  }
});
adminRoutes.post("/users/:id/status", async (c) => {
  const db = c.get("db");
  const admin = c.get("user");
  const userId = c.req.param("id");
  const body = await c.req.json();
  if (admin.role !== "SUPER_ADMIN") {
    return c.json({ success: false, error: "Unauthorized: Only Super Admins can change user status" }, 403);
  }
  if (!["ACTIVE", "FROZEN", "BANNED"].includes(body.status)) {
    return c.json({ success: false, error: "Invalid status" }, 400);
  }
  try {
    await db.update(users).set({ status: body.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId));
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: "Failed to update user status" }, 500);
  }
});
adminRoutes.put("/users/:id/role", async (c) => {
  const db = c.get("db");
  const admin = c.get("user");
  const userId = c.req.param("id");
  const body = await c.req.json();
  if (admin.role !== "SUPER_ADMIN") {
    return c.json({ success: false, error: "Unauthorized: Only Super Admins can change user roles" }, 403);
  }
  if (!["USER", "SUPPORT_ADMIN", "COMPLIANCE_ADMIN", "SUPER_ADMIN"].includes(body.role)) {
    return c.json({ success: false, error: "Invalid role" }, 400);
  }
  try {
    await db.update(users).set({ role: body.role, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId));
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: "Failed to update user role" }, 500);
  }
});
adminRoutes.post("/users/:id/wallets/adjust", async (c) => {
  const db = c.get("db");
  const admin = c.get("user");
  const userId = c.req.param("id");
  const body = await c.req.json();
  if (admin.role !== "SUPER_ADMIN") {
    return c.json({ success: false, error: "Unauthorized: Only Super Admins can adjust balances" }, 403);
  }
  const { assetSymbol, amount, type, action } = body;
  try {
    const { and: and2, eq: eq2 } = require_drizzle_orm();
    const { wallets: wallets2 } = (init_schema(), __toCommonJS(schema_exports));
    let wallet = await db.select().from(wallets2).where(
      and2(eq2(wallets2.userId, userId), eq2(wallets2.assetSymbol, assetSymbol), eq2(wallets2.type, type))
    ).get();
    if (!wallet) {
      if (action === "DEBIT") {
        return c.json({ success: false, error: "Insufficient balance to debit" }, 400);
      }
      await db.insert(wallets2).values({
        id: crypto.randomUUID(),
        userId,
        assetSymbol,
        type,
        balance: amount.toString(),
        lockedBalance: "0",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
    } else {
      let currentBalance = parseFloat(wallet.balance);
      let adjustment = parseFloat(amount);
      if (action === "DEBIT") {
        if (currentBalance < adjustment) {
          return c.json({ success: false, error: "Insufficient balance" }, 400);
        }
        currentBalance -= adjustment;
      } else {
        currentBalance += adjustment;
      }
      await db.update(wallets2).set({ balance: currentBalance.toString(), updatedAt: /* @__PURE__ */ new Date() }).where(eq2(wallets2.id, wallet.id));
    }
    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: "Failed to adjust wallet balance" }, 500);
  }
});
adminRoutes.get("/kyc", async (c) => {
  const db = c.get("db");
  try {
    const pendingKyc = await db.select().from(kycProfiles).orderBy(desc(kycProfiles.createdAt)).all();
    return c.json({ success: true, data: pendingKyc });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch KYC profiles" }, 500);
  }
});
adminRoutes.post("/kyc/:id/status", async (c) => {
  const db = c.get("db");
  const admin = c.get("user");
  const kycId = c.req.param("id");
  const body = await c.req.json();
  if (!["APPROVED", "REJECTED"].includes(body.status)) {
    return c.json({ success: false, error: "Invalid status" }, 400);
  }
  try {
    await db.update(kycProfiles).set({
      status: body.status,
      rejectionReason: body.rejectionReason || null,
      reviewedBy: admin.id,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(kycProfiles.id, kycId));
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: "Failed to update KYC status" }, 500);
  }
});

// src/routes/notifications.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
var notificationRoutes = new Hono2();
notificationRoutes.use("*", jwtMiddleware);
notificationRoutes.get("/", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    const list = await db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt)).all();
    return c.json({ success: true, data: list });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ success: false, error: "Failed to fetch notifications" }, 500);
  }
});
notificationRoutes.patch("/:id/read", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const id = c.req.param("id");
  try {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error marking notification read:", error);
    return c.json({ success: false, error: "Failed to mark notification as read" }, 500);
  }
});
notificationRoutes.post("/read-all", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    return c.json({ success: false, error: "Failed to mark all as read" }, 500);
  }
});

// src/routes/support.ts
init_checked_fetch();
init_modules_watch_stub();
init_schema();
var supportRoutes = new Hono2();
supportRoutes.use("*", jwtMiddleware);
var generateId = /* @__PURE__ */ __name((prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`, "generateId");
supportRoutes.get("/tickets", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    const list = await db.select().from(tickets).where(eq(tickets.userId, user.id)).orderBy(desc(tickets.updatedAt)).all();
    return c.json({ success: true, data: list });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return c.json({ success: false, error: "Failed to fetch tickets" }, 500);
  }
});
supportRoutes.post("/tickets", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  if (!body.subject || !body.category || !body.message) {
    return c.json({ success: false, error: "Missing required fields" }, 400);
  }
  try {
    const ticketId = generateId("TIC");
    const now = /* @__PURE__ */ new Date();
    await db.insert(tickets).values({
      id: ticketId,
      userId: user.id,
      subject: body.subject,
      category: body.category,
      priority: body.priority || "MEDIUM",
      status: "OPEN",
      createdAt: now,
      updatedAt: now
    });
    await db.insert(ticketMessages).values({
      id: generateId("MSG"),
      ticketId,
      senderId: user.id,
      isAdmin: false,
      content: body.message,
      createdAt: now
    });
    const newTicket = await db.select().from(tickets).where(eq(tickets.id, ticketId)).get();
    return c.json({ success: true, data: newTicket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return c.json({ success: false, error: "Failed to create ticket" }, 500);
  }
});
supportRoutes.get("/tickets/:id/messages", async (c) => {
  const db = c.get("db");
  const ticketId = c.req.param("id");
  try {
    const messages = await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt).all();
    return c.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return c.json({ success: false, error: "Failed to fetch messages" }, 500);
  }
});
supportRoutes.post("/tickets/:id/messages", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const ticketId = c.req.param("id");
  const body = await c.req.json();
  if (!body.content) {
    return c.json({ success: false, error: "Missing content" }, 400);
  }
  try {
    const now = /* @__PURE__ */ new Date();
    await db.insert(ticketMessages).values({
      id: generateId("MSG"),
      ticketId,
      senderId: user.id,
      isAdmin: false,
      // User is sending
      content: body.content,
      createdAt: now
    });
    await db.update(tickets).set({ updatedAt: now, status: "OPEN" }).where(eq(tickets.id, ticketId));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return c.json({ success: false, error: "Failed to send message" }, 500);
  }
});

// src/routes/settings.ts
init_checked_fetch();
init_modules_watch_stub();
var QRCode = __toESM(require_browser());
init_schema();
init_schema();
var authenticator2 = void 0 || (void 0)?.authenticator;
var settingsRoutes = new Hono2();
settingsRoutes.use("*", jwtMiddleware);
settingsRoutes.get("/profile", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    const profile = await db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarUrl: users.avatarUrl,
      mfaEnabled: users.mfaEnabled,
      emailVerified: users.emailVerified,
      status: users.status
    }).from(users).where(eq(users.id, user.id)).get();
    return c.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({ success: false, error: "Failed to fetch profile" }, 500);
  }
});
settingsRoutes.patch("/profile", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  try {
    await db.update(users).set({
      displayName: body.displayName,
      firstName: body.firstName,
      lastName: body.lastName,
      avatarUrl: body.avatarUrl,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, user.id));
    const updatedUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    return c.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ success: false, error: "Failed to update profile" }, 500);
  }
});
settingsRoutes.post("/change-password", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  try {
    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    const encoder = new TextEncoder();
    const currentData = encoder.encode(body.currentPassword);
    const currentHashBuf = await crypto.subtle.digest("SHA-256", currentData);
    const currentHash = Array.from(new Uint8Array(currentHashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (currentUser?.passwordHash !== currentHash) {
      return c.json({ success: false, error: "Incorrect current password" }, 400);
    }
    const newData = encoder.encode(body.newPassword);
    const newHashBuf = await crypto.subtle.digest("SHA-256", newData);
    const newHash = Array.from(new Uint8Array(newHashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    await db.update(users).set({ passwordHash: newHash, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return c.json({ success: false, error: "Failed to change password" }, 500);
  }
});
settingsRoutes.post("/mfa/generate", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    if (currentUser?.mfaEnabled) {
      return c.json({ success: false, error: "MFA is already enabled" }, 400);
    }
    const secret = authenticator2.generateSecret();
    const otpauth = authenticator2.keyuri(currentUser?.email || user.id, "Ethsltd", secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    await db.update(users).set({ mfaSecret: secret }).where(eq(users.id, user.id));
    return c.json({ success: true, data: { secret, qrCodeUrl } });
  } catch (error) {
    console.error("Error generating MFA:", error);
    return c.json({ success: false, error: "Failed to generate MFA" }, 500);
  }
});
settingsRoutes.post("/mfa/enable", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const token = body.token;
  if (!token) return c.json({ success: false, error: "Token is required" }, 400);
  try {
    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    if (!currentUser?.mfaSecret) {
      return c.json({ success: false, error: "MFA secret not found. Generate it first." }, 400);
    }
    const isValid = authenticator2.verify({ token, secret: currentUser.mfaSecret });
    if (!isValid) {
      return c.json({ success: false, error: "Invalid 2FA token" }, 400);
    }
    await db.update(users).set({ mfaEnabled: true }).where(eq(users.id, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error enabling MFA:", error);
    return c.json({ success: false, error: "Failed to enable MFA" }, 500);
  }
});
settingsRoutes.post("/mfa/disable", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  const token = body.token;
  if (!token) return c.json({ success: false, error: "Token is required" }, 400);
  try {
    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    if (!currentUser?.mfaEnabled || !currentUser?.mfaSecret) {
      return c.json({ success: false, error: "MFA is not enabled" }, 400);
    }
    const isValid = authenticator2.verify({ token, secret: currentUser.mfaSecret });
    if (!isValid) {
      return c.json({ success: false, error: "Invalid 2FA token" }, 400);
    }
    await db.update(users).set({ mfaEnabled: false, mfaSecret: null }).where(eq(users.id, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error disabling MFA:", error);
    return c.json({ success: false, error: "Failed to disable MFA" }, 500);
  }
});
settingsRoutes.get("/sessions", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    const activeSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id)).all();
    return c.json({ success: true, data: activeSessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ success: false, error: "Failed to fetch sessions" }, 500);
  }
});
settingsRoutes.delete("/sessions/:id", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const sessionId = c.req.param("id");
  try {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return c.json({ success: false, error: "Failed to revoke session" }, 500);
  }
});
settingsRoutes.delete("/sessions/all-except-current", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  try {
    await db.delete(sessions).where(eq(sessions.userId, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting all sessions:", error);
    return c.json({ success: false, error: "Failed to revoke sessions" }, 500);
  }
});
settingsRoutes.post("/kyc", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const body = await c.req.json();
  try {
    const existing = await db.select().from(kycProfiles).where(eq(kycProfiles.userId, user.id)).get();
    if (existing && existing.status === "APPROVED") {
      return c.json({ success: false, error: "KYC is already approved" }, 400);
    }
    const now = /* @__PURE__ */ new Date();
    if (existing) {
      await db.update(kycProfiles).set({
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        country: body.country,
        documentType: body.documentType,
        documentNumber: body.documentNumber,
        documentFrontUrl: body.documentFrontBase64 || existing.documentFrontUrl,
        documentBackUrl: body.documentBackBase64 || existing.documentBackUrl,
        selfieUrl: body.selfieBase64 || existing.selfieUrl,
        status: "PENDING",
        updatedAt: now
      }).where(eq(kycProfiles.id, existing.id));
    } else {
      await db.insert(kycProfiles).values({
        id: `KYC-${Date.now()}`,
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        country: body.country,
        documentType: body.documentType,
        documentNumber: body.documentNumber,
        documentFrontUrl: body.documentFrontBase64 || "",
        documentBackUrl: body.documentBackBase64,
        selfieUrl: body.selfieBase64 || "",
        status: "PENDING",
        createdAt: now,
        updatedAt: now
      });
    }
    return c.json({ success: true, message: "KYC documents submitted successfully" });
  } catch (error) {
    console.error("Error submitting KYC:", error);
    return c.json({ success: false, error: "Failed to submit KYC documents" }, 500);
  }
});

// src/index.ts
var app = new Hono2();
app.use("*", cors({
  origin: /* @__PURE__ */ __name((origin) => origin || "*", "origin"),
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Trading-Mode"]
}));
app.use("*", async (c, next) => {
  c.set("db", createDb(c.env.DB));
  await next();
});
app.get("/", (c) => c.json({ status: "ok", service: "Ethsltd API", version: "1.0" }));
app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/wallets", walletRoutes);
app.route("/api/v1/trading", tradingRoutes);
app.route("/api/v1/p2p", p2pRoutes);
app.route("/api/v1/admin", adminRoutes);
app.route("/api/v1/notifications", notificationRoutes);
app.route("/api/v1/support", supportRoutes);
app.route("/api/v1/settings", settingsRoutes);
var src_default = app;

// ../../node_modules/.pnpm/wrangler@4.122.0_@cloudflare+workers-types@5.20260813.1/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.pnpm/wrangler@4.122.0_@cloudflare+workers-types@5.20260813.1/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-O98dHm/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/.pnpm/wrangler@4.122.0_@cloudflare+workers-types@5.20260813.1/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-O98dHm/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
