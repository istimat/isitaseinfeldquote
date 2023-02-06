class DialogueRepository {
    
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
        CREATE TABLE IF NOT EXISTS dialogues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          count INTEGER,
          season INTEGER,
          episode INTEGER,
          actor TEXT,
          dialogue TEXT)`
      return this.dao.run(sql)
    }

    create(count, season, episode, actor, dialogue) {
        return this.dao.run(
          `INSERT INTO dialogues (count, season, episode, actor, dialogue)
            VALUES (?, ?, ?, ?, ?)`,
          [count, season, episode, actor, dialogue])
      }
    
    getBefore(index,numberOfLines) {
      var lowest = index - numberOfLines;
      var highest = index - 1;
      var sqlParams = [lowest, highest]
      return this.dao.all(
          `SELECT * FROM 'dialogues' where count between ? and ? order by count asc`, sqlParams)
    }  

    getAfter(index,numberOfLines) {
      var lowest = index + 1;
      var highest = index + numberOfLines;
      var sqlParams = [lowest, highest]
      return this.dao.all(
          `SELECT * FROM 'dialogues' where count between ? and ? order by count asc`, sqlParams)
    } 

    getAll() {
        return this.dao.all(`SELECT * FROM dialogues`)
    }

  }

  module.exports = DialogueRepository