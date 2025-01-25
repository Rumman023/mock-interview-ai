/** @type {import("drizzle-kit").Config}*/

export default {
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_4ziQUpIE0mty@ep-tiny-recipe-a852ib6e-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
    }
};