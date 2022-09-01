const quoteList = document.getElementById('quote-list')
const newQuoteForm = document.getElementById('new-quote-form')
const url = 'http://localhost:3000/quotes'

function getQuotes() {
    fetch(`${url}`)
    .then(resp => resp.json())
    .then(quotes => displayQuotes(quotes))
}

getQuotes()


function displayQuotes(quotes) {
    quotes.forEach(quote => {
        quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-id='${quote.id}' class='btn-success'>Likes: <span>${quote.likes}</span></button>
          <button data-id='${quote.id}' class='btn-danger'>Delete</button>
          </blockquote>
        </li>
        `
        })
       
    }

newQuoteForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const newQuote = document.getElementById('new-quote').value
    const newAuthor = document.getElementById('author').value
   
    fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor,
            likes: 0,
        })
        
        })
        .then(resp => resp.json())
        .then(newEntry => {
            quoteList.innerHTML += `
            <li class='quote-card'>
              <blockquote class="blockquote">
              <p class="mb-0">${newEntry.quote}</p>
              <footer class="blockquote-footer">${newEntry.author}</footer>
              <br>
              <button data-id='${newEntry.id}' class='btn-success'>Likes: <span>${newEntry.likes}</span></button>
              <button data-id='${newEntry.id}' class='btn-danger'>Delete</button>
              </blockquote>
            </li>
            `        
    })    
    e.target.reset()  
})


quoteList.addEventListener('click', (e) => {
    if (e.target.className === 'btn-danger') {
    
    fetch(`${url}/${e.id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(resp => {
        e.target.parentElement.parentElement.remove()
    })
    }
    if (e.target.className === 'btn-success') {
        const likeAmount = parseInt(e.target.innerText.substr(-1))

        fetch(`${url}/${e.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify ({
                likes: likeAmount + 1,
            })
        })
        .then(resp => resp.json())
        .then(resp => {
            e.target.innerText = `Likes: ${likeAmount + 1}`  
        })  
    }
})


