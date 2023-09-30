/*
Workaround TS error when importing fontAwesome icon trough svelte-fa
Error: Could not find a declaration file for module '/Users/Coding/repos/ididit.fyi/node_modules/svelte-fa/src/fa.svelte'.
Error: Could not find a declaration file for module '/Users/Coding/repos/ididit.fyi/node_modules/@fortawesome/free-brands-svg-icons/index.mjs'.
*/
declare module '*.svelte';
declare module '*.mjs';