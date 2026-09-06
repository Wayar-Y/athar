import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const directory = process.env.ATHAR_DATA_DIR || path.resolve('data');
mkdirSync(directory, {recursive: true});
const db = new DatabaseSync(path.join(directory, 'athar.sqlite'));
db.exec('CREATE TABLE IF NOT EXISTS records (name TEXT PRIMARY KEY, value TEXT NOT NULL, revision INTEGER NOT NULL)');
const app = express();
app.use(express.json({limit: '12mb'}));
app.use('/api', (req, res, next) => {
  const origin = req.get('origin');
  if (origin && !['http://localhost:3000','http://127.0.0.1:3000','http://localhost:3001','http://127.0.0.1:3001'].includes(origin)) {
    res.status(403).json({error:'Origin not allowed'}); return;
  }
  next();
});
app.param('name', (req, res, next, name) => {
  if (!['fleet','devices','notifications','workorders'].includes(name)) { res.sendStatus(404); return; }
  next();
});
app.get('/api/records/:name', (req, res) => {
  const row = db.prepare('SELECT value, revision FROM records WHERE name = ?').get(req.params.name) as {value:string;revision:number}|undefined;
  res.json(row ? {value:JSON.parse(row.value), revision:row.revision} : {value:null, revision:0});
});
app.put('/api/records/:name', (req, res) => {
  const {value, revision} = req.body;
  if (!Array.isArray(value) || !Number.isInteger(revision) || revision < 0) { res.sendStatus(400); return; }
  db.exec('BEGIN IMMEDIATE');
  try {
    const row = db.prepare('SELECT revision FROM records WHERE name = ?').get(req.params.name) as {revision:number}|undefined;
    if ((row?.revision || 0) !== revision) { db.exec('ROLLBACK'); res.sendStatus(409); return; }
    db.prepare('INSERT INTO records(name,value,revision) VALUES(?,?,?) ON CONFLICT(name) DO UPDATE SET value=excluded.value, revision=excluded.revision')
      .run(req.params.name, JSON.stringify(value), revision+1);
    db.exec('COMMIT'); res.json({revision:revision+1});
  } catch (e) { db.exec('ROLLBACK'); throw e; }
});
app.use(express.static(path.resolve('dist')));
app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
app.listen(3001,'127.0.0.1', () => console.log('Athar local server ready on port 3001'));
