// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge } = require('electron');

// Usuwam całą logikę związaną z @tonejs/midi i eksportem MIDI przez preload.js
