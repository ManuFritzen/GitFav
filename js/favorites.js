import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector('table tbody')
    this.load()
    this.favEmpty()
  }
  
  
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }
  
  
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  
  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)
      
      if( userExists ) {
        throw new Error('Usuário já foi favoritado!')
      } else {this.load()}

      const user = await GithubUser.search(username)
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      
    } catch(error) {
      alert(error.message)
    }
  }
  
  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)
    
    this.entries = filteredEntries
    this.update()
    this.save()
    
  }
  
  favEmpty(){
    if (this.entries.length == 0) {
      this.removeAllTr()
      const empty = document.createElement('tr')
      empty.innerHTML = `<td class="favEmpty">
      <img src="images/Estrela (1).svg" alt="">
      Você não tem um usuário do Github favorito?</td>`
  
      this.tbody.append(empty)
    }
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#input-search')

      this.add(value)
    }
  }

  update() {
      
    if (this.entries.length != 0) {
      this.removeAllTr()
    }

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com//${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Deseja deletar este usuário de seus favoritos?')

        if (isOk) {
          this.delete(user)
        }
        this.favEmpty()
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
          <td class="user">
            <img src="https://github.com/ManuFritzen.png" alt="imagem de ManuFritzen">
            <a href="https://github.com/ManuFritzen" target="_blank">
              <p>Manu Fritzen</p>
              <span>ManuFritzen</span>
            </a>
          </td>
          <td class="repositories">8</td>
          <td class="followers">8</td>
          <td class="remove">Remover</td>    
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
