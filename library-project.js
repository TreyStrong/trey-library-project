//library project

var Library;

(function() {
    var instance;

    Library = function () {
        // return the instance if we already have one
        if (instance) {
          return instance;
        }

        instance = this;

    this.retrieveLibrary = function(){                              //   retrieve local storage
        if (typeof(Storage) !== undefined) {
            try{
                var storedLibraryData = localStorage.getItem("storedLibrary"); //get from local storage
                var parsedLibrary = JSON.parse(storedLibraryData);              //parse the previous data
                if(parsedLibrary === null || parsedLibrary.length === 0){ // there was nothing in the library
                    this.booksList = [];
                    return false; 
                } else {
                    this.booksList = [];                            //define the book list
                    for(var i = 0; i < parsedLibrary.length; i++){  //fill the myLibrary.booksList w/parsed info
                        var  bookToAdd = new Book(parsedLibrary[i].title, parsedLibrary[i].author, parsedLibrary[i].numberOfPages, new Date(parsedLibrary[i].publishDate));
                        this.addBook(bookToAdd);
                        }
                }
                return true;
            } catch (caughtError) {
                this.booksList = [];          // do nothing
            }
        }
    };
            
    this.retrieveLibrary();
    if(this.booksList.length === 0){        // create new [] books, if localStorage === null
            this.booksList = [];
    };

    this.storeLibrary = function(){            //write to local storage
       
        for(var i = 0; i < this.booksList.length; i++){
            this.booksList[i].publishDate = this.booksList[i].publishDate.toString(); //convert dates to strings first
        }
        try {
            if (typeof(Storage) !== "undefined") {
                var strJSON = JSON.stringify(this.booksList);       //stringify booksList
                localStorage.setItem("storedLibrary",strJSON);      //write booksList
                return true;
            } else {
                return false;
            }
        } catch(caughtError) {
            // do not store
            }
        };
    };
})();

Library.prototype.init = function() {
    $("#add-book-form").hide();
};


var Book = function(args) {    //Book prototype
    this.title = args.title;
    this.author = args.author;
    this.numberOfPages = args.numberOfPages;
    this.publishDate = new Date(args.publishDate);
};


Library.prototype.addBook = function(book) {
    var isBookThere = false; 
    if ((typeof(book) === "object") && (book !== null)) {
        for (var i = 0; i < this.booksList.length; i++) {
            if (book.title === this.booksList[i].title) { 
                if (book.author.toLowerCase() === this.booksList[i].author.toLowerCase()) {
                    isBookThere = true;
                }
            }
        }
    }
    if (isBookThere === false) {
        this.booksList.push(book);
        console.log(book);
        // $("#bookTable").append(
        //     `<tr>
        //         <td>${book.title}</td>
        //         <td>${book.author}</td>
        //         <td>${book.numberOfPages}</td>
        //         <td>${book.publishDate}</td>
        //     </tr>`
        // );
        return true;
    } else{
        return false;
    }
       
};


Library.prototype.removeBookByTitle = function (title) {
    if( (typeof(title) === "string") && (title !== null)) {
        for (var i = this.booksList.length-1; i >= 0; i--) {
            if (title.toLowerCase() === this.booksList[i].title.toLowerCase()) {
                this.booksList.splice(i,1);
                this.storeLibrary(); 
                return true;
            } 
        }
    }
};


Library.prototype.removeBooksByAuthor = function (author) {
    if((typeof(author) === "string") && (author !== null)) {
        for (var i = this.booksList.length-1; i >= 0; i--) {
            if (author.toLowerCase() === this.booksList[i].author.toLowerCase()) {
                this.booksList.splice(i,1);
                this.storeLibrary(); 
                return true;
            } 
        }  
    }
};

Library.prototype.getRandomBook = function() {
    if (this.booksList.length === 0) {
        return null;
    } else {
    var randBook = Math.floor(Math.random() * (this.booksList.length - 1));
      return this.booksList[randBook];
    }
};


Library.prototype.getBookByTitle = function(title) {
    var titlesArray = [];
    if( (typeof(title) === "string") && (title !== null)) {
        for (var i = 0; i < this.booksList.length; i++) {
            if (this.booksList[i].title.indexOf(title) !== -1) {
                titlesArray.push(this.booksList[i]);
            }
        }
    }
    return titlesArray;
};


Library.prototype.getBooksByAuthor = function(author) {
    var authorsArray = [];
        for (var i = 0; i < this.booksList.length; i++) {
            if (this.booksList[i].author.indexOf(author) !== -1 ) {
                authorsArray.push(this.booksList[i]);
            }
        }
    return authorsArray;
};

Library.prototype.addBooks = function(books) {
    var bookCount = 0;
    if ((Array.isArray(books)) && (typeof(books) !== undefined)) {
        for (var i = 0; i < books.length; i++) {
            if (this.addBook(books[i])) {
                bookCount++;
            }
        }
    } else {
        console.log("Input is not valid");
    }  
    this.storeLibrary();  
    return bookCount;
};


Library.prototype.getAuthors = function() {
    var authorNameArray = [];
    for (var i = 0; i < this.booksList.length; i++) {
        if (authorNameArray.indexOf(this.booksList[i].author) === -1) {
            authorNameArray.push(this.booksList[i].author);
        }
    }
    return authorNameArray;
};


Library.prototype.getRandomAuthorName = function() {
    if (this.booksList.length === 0) {
        return null;
    } else {
        var shortAuthorsList = this.getAuthors();
        var randBook = Math.floor(Math.random() * (shortAuthorsList.length -1));
        return this.booksList[randBook].author;
    }
};

Library.prototype.getBookInput = function(args){
    newBook = new Book(args);
    newBook.title = $("#title-input").val();
    newBook.author = $("#author-input").val()
    newBook.numberOfPages = $("#page-input").val();
    newBook.publishDateDate = new Date($("#date-input").val());
    console.log(newBook);
    this.AddBook(newBook);
    this.storeLibrary();
       
    
}; 


$("#add-book").on( {
    click: function() {
        $("#add-book-form").show();

    }
});

$("#add-button").on( {
    click: function () {
      myLibrary.getBookInput();
    } 
});

$("#add-many-books").on( {
    click: function() {
        document.getElementById("display-results").innerHTML = "add multiple books";
    }
});

$("#remove-title").on( {
    click: function() {
        document.getElementById("display-results").innerHTML =         
        `<form  action='/action_page.php'
            <div class="form-group">
                <input type="search" class="form-control"  placeholder="Remove Title">
            </div>
        </form>`;
    }
});

$("#remove-author").on( {
    click: function() {
        document.getElementById("display-results").innerHTML = 
        `<form  action='/action_page.php'
            <div class="form-group">
                <input type="search" class="form-control"  placeholder="Remove Author">
            </div>
        </form>`;
    }
});

$("#find-title").on( {
    click: function() {
        document.getElementById("display-results").innerHTML =         
        `<form  action='/action_page.php'
        <div class="form-group">
            <input type="search" class="form-control"  placeholder="Find Title">
        </div>
    </form>`;;
    }
});

$("#find-author").on( {
    click: function() {
        document.getElementById("display-results").innerHTML =         
        `<form  action='/action_page.php'
        <div class="form-group">
            <input type="search" class="form-control"  placeholder="Find Author">
        </div>
    </form>`;
    }
});

$("#get-authors").on( {
    click: function() {
        document.getElementById("display-results").innerHTML = "myLibrary.getAuthors()";
    }
});

$("#get-rand-book").on( {
    click: function() {
        document.getElementById("display-results").innerHTML = "myLibrary.getRandomBook()";
    }
});

$("#get-rand-author").on( {
    click: function() {
        document.getElementById("display-results").innerHTML = "myLibrary.getRandomAuthorName()";
    }
});





// test cases

   $(function(){
    window.myLibrary = new Library();
    window.myLibrary.init();
   });


// var booksArray = [
//     (new Book("The Hobbit","J.R.R. Tolkien", 300, "September 21, 1937")),
//     (new Book("The Sword of Shannara","Terry Brooks", 700, "1977")),
//     (new Book("The Elfstones of Shannara","Terry Brooks", 700, "1980")),
//     (new Book("The Wishsong of Shannara","Terry Brooks", 700, "1985")),
//     (new Book("Ready Player One","Ernest Cline", 400, "August 16, 2011")),
//     (new Book("The Crystal Shard","R. A. Salvatore", 400, "1988")),
//     (new Book("Dragons of Autumn Twilight","Margaret Weiss and Tracy Hickman", 300, "1984")),
//     (new Book("The Stand","Stephen King", 1000, "1978")),
//     (new Book("The Fellowship of the Ring","J.R.R. Tolkien", 500, "September 21, 1945")),
//     (new Book("The Two Towers","J.R.R. Tolkien", 500, "November 21, 1946")),
//     (new Book("The Return of the King", "J.R.R. Tolkien", 500, "August 21, 1947")),
//     (new Book("The Lion, The Witch and the Wardrobe", "C.S.Lewis", 200, "1945"))
//     ];


// console.log(myLibrary.addBooks(booksArray));            //add Books test
// console.log(myLibrary.booksList);

// console.log(myLibrary.addBooks(booksArray));            //add books duplicate books test


// console.log(myLibrary.addBook(new Book("Harry Potter and the Sorcerer's Stone","J.K. Rowling", 300, "June 26, 1997")));    //add book test

// console.log(myLibrary.addBook(new Book("Ready Player One","Ernest Cline", 400, "August 16, 2011"))); //add book already in library //add duplicate book

// console.log(myLibrary.removeBookByTitle("The Hobbit"));        //remove book by title test

// console.log(myLibrary.removeBooksByAuthor("J.R.R. Tolkien"));     //remove book by author test
// console.log(myLibrary.booksList);

// console.log(myLibrary.getRandomBook());                       //random book test
// console.log(myLibrary.getRandomBook());


                   
// console.log(myLibrary.getRandomAuthorName());                     //random author tests
// console.log(myLibrary.getRandomAuthorName());
// console.log(myLibrary.getRandomAuthorName());
// console.log(myLibrary.getRandomAuthorName());
// console.log(myLibrary.getRandomAuthorName());
// console.log(myLibrary.getRandomAuthorName());

// console.log(myLibrary.getBookByTitle("Ready Player One"));              //get books by title test

// console.log(myLibrary.getBooksByAuthor("Terry Brooks"));                  //get books by author test
// console.log(myLibrary.getBooksByAuthor("Brooks"));

// console.log(myLibrary.getAuthors());                            //get authors test





