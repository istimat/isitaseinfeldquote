class DialogueRepository {
    
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
        CREATE TABLE IF NOT EXISTS dialogues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          season INTEGER,
          episode INTEGER,
          actor TEXT,
          dialogue TEXT)`
      return this.dao.run(sql)
    }

    create(season, episode, actor, dialogue) {
        return this.dao.run(
          `INSERT INTO dialogues (season, episode, actor, dialogue)
            VALUES (?, ?, ?, ?)`,
          [season, episode, actor, dialogue])
      }
    
    getAll() {
        return this.dao.all(`SELECT * FROM dialogues`)
    }

  }

  module.exports = DialogueRepository