
//library constructor
var Library;
var bookTitleId = 'bookTitle';
var bookAuthorId = 'bookAuthor';
var bookPageId = 'bookPage';
var bookDateId = 'bookDate';
var bookIdCounter = 0;

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

var Book = function(title, author, numberOfPages, publishDate) {    //Book prototype
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.publishDate = new Date(publishDate);
};

//Library functions

Library.prototype.init = function() {
    $("#edit-book-form").hide();
    document.getElementById("display-results").innerHTML = "";
    this._bindEvents();

};



Library.prototype._bindEvents = function() {
    $("#add-book").on("click", $.proxy(this.showEditForm, this, 1)); 
    $("#add-button").on("click", $.proxy(this.addBookHandler,this));
    $("#add-many-books").on("click", $.proxy(this.showEditForm, this, 2));
    $("#add-more-button").on("click",$.proxy(this.addMoreBooksHandler, this));
    $("#done-button").on("click", $.proxy(this.addAllBooks, this));
    $("#remove-title").on("click", $.proxy(this.showEditForm, this, 3));  
    $("#remove-button-t").on("click", $.proxy(this.removeTitleHandler,this));
    $("#remove-author").on("click", $.proxy(this.showEditForm, this, 4)); 
    $("#remove-button-a").on("click", $.proxy(this.removeAuthorHandler,this));
    $("#find-title").on("click",  $.proxy(this.showEditForm, this, 5));
    $("#find-title-button").on("click", $.proxy(this.findTitleHandler,this));
    $("#find-author").on("click", $.proxy(this.showEditForm, this, 6));
    $("#find-author-button").on("click", $.proxy(this.findAuthorHandler,this));
    $("#get-authors").on("click", $.proxy(this.listAuthorsHandler, this));
    $("#get-rand-book").on("click", $.proxy(this.randomBookHandler, this));
    $("#get-rand-author").on("click", $.proxy(this.randomAuthorHandler, this));
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
        $("#bookTableBody").append(
            `<tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.numberOfPages}</td>
                <td>${book.publishDate}</td>
            </tr>`
        );
        document.getElementById("display-results").innerHTML = book.title + " was added to the Library.";
        return true;
    } else{
        return false;
    }
       
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
    document.getElementById("display-results").innerHTML = "You added " + bookCount + " books to the library.";
    return bookCount;
};

Library.prototype.removeBookByTitle = function (title) {
    var wereBooksRemoved = false;
    if( (typeof(title) === "string") && (title !== null)) {
        for (var i = this.booksList.length-1; i >= 0; i--) {
            if (title.toLowerCase() === this.booksList[i].title.toLowerCase()) {
                this.booksList.splice(i,1);
                document.getElementById("bookTableBody").deleteRow(i);
                document.getElementById("display-results").innerHTML = title + " was removed from the library.";
                this.storeLibrary(); 
                wereBooksRemoved =  true;
            }; 
        };
    };
    if (wereBooksRemoved === false) {
        document.getElementById("display-results").innerHTML = "No books were removed from the library.";
    };
    return wereBooksRemoved;
};

Library.prototype.removeBooksByAuthor = function (author) {
    var wereBooksRemoved = false;
    if((typeof(author) === "string") && (author !== null)) {
        for (var i = this.booksList.length-1; i >= 0; i--) {
            if (author.toLowerCase() === this.booksList[i].author.toLowerCase()) {
                this.booksList.splice(i,1);
                document.getElementById("bookTableBody").deleteRow(i);
                document.getElementById("display-results").innerHTML = "All books by " + author + " were removed from the library.";
                this.storeLibrary(); 
                wereBooksRemoved = true;
            } 
        }  
    }
    if (wereBooksRemoved === false) {
        document.getElementById("display-results").innerHTML = "No books were removed from the library.";
    };
    return wereBooksRemoved;
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

Library.prototype.showEditForm = function (num) {
    document.getElementById("display-results").innerHTML = "";
    switch(num) {
        default: 
            $("#edit-book-form").hide();
            document.forms["edit-book-form"].reset();
            break;
        case 1:
            $("#edit-book-form").show();
            document.forms["edit-book-form"].reset();
            $("#bookTitle0").show();
            $("#bookAuthor0").show();
            $("#bookPage0").show();
            $("#bookDate0").show();
            $("#add-more-button").hide();
            $("#done-button").hide();
            $("#add-button").show();
            $("#remove-button-t").hide();
            $("#remove-button-a").hide();
            $("#find-title-button").hide();
            $("#find-author-button").hide();
            break;
        case 2:
            $("#edit-book-form").show();
            document.forms["edit-book-form"].reset();
            $("#bookTitle0").show();
            $("#bookAuthor0").show();
            $("#bookPage0").show();
            $("#bookDate0").show();
            $("#add-more-button").show();
            $("#done-button").show();
            $("#add-button").hide();
            $("#remove-button-t").hide();
            $("#remove-button-a").hide();
            $("#find-title-button").hide();
            $("#find-author-button").hide();
            break;
        case 3:
            $("#edit-book-form").show();
            document.forms["edit-book-form"].reset();
            $("#bookTitle0").show();
            $("#bookAuthor0").hide();
            $("#bookPage0").hide();
            $("#bookDate0").hide();
            $("#add-more-button").hide();
            $("#done-button").hide();
            $("#add-button").hide();
            $("#remove-button-t").show();
            $("#remove-button-a").hide();
            $("#find-title-button").hide();
            $("#find-author-button").hide();
            break;
        case 4:
            $("#edit-book-form").show();
            document.forms["edit-book-form"].reset();
            $("#bookTitle0").hide();
            $("#bookAuthor0").show();
            $("#bookPage0").hide();
            $("#bookDate0").hide();
            $("#add-more-button").hide();
            $("#done-button").hide();
            $("#add-button").hide();
            $("#remove-button-t").hide();
            $("#remove-button-a").show();
            $("#find-title-button").hide();
            $("#find-author-button").hide();
            break;
        case 5:
            $("#edit-book-form").show();
            document.forms["edit-book-form"].reset();
            $("#bookTitle0").show();
            $("#bookAuthor0").hide();
            $("#bookPage0").hide();
            $("#bookDate0").hide();
            $("#add-more-button").hide();
            $("#done-button").hide();
            $("#add-button").hide();
            $("#remove-button-t").hide();
            $("#remove-button-a").hide();
            $("#find-title-button").show();
            $("#find-author-button").hide();
            break;
        case 6:
            $("#edit-book-form").show();
            document.forms["edit-book-form"].reset();
            $("#bookTitle0").hide();
            $("#bookAuthor0").show();
            $("#bookPage0").hide();
            $("#bookDate0").hide();
            $("#add-more-button").hide();
            $("#done-button").hide();
            $("#add-button").hide();
            $("#remove-button-t").hide();
            $("#remove-button-a").hide();
            $("#find-title-button").hide();
            $("#find-author-button").show();
            break;

    }
}

Library.prototype.clearTopForm = function () {
    document.forms["edit-book-form"].reset();
    $("#edit-book-form").hide();
    elementCounter = 0;
}

Library.prototype.addBookHandler = function(newTitle, newAuthor, newPages, newPubDate){
    var newBook = this.makeNewBook(newTitle, newAuthor, newPages, newPubDate);
    this.addBook(newBook);
    this.storeLibrary();
    this.clearTopForm();
}; 

Library.prototype.addMoreBooksHandler = function () {
    ++bookIdCounter;
    var br = document.createElement("br");
    var newTitle = $('<input/>').attr({ type: 'text', name: 'title', placeholder: 'Title', id: bookTitleId + bookIdCounter }).addClass("form-control");
    var newAuthor = $('<input/>').attr({ type: 'text', name: 'author', placeholder: 'Author', id: bookAuthorId + bookIdCounter }).addClass("form-control");
    var newPage = $('<input/>').attr({ type: 'text', name: 'pages', placeholder: 'Pages', id: bookPageId + bookIdCounter }).addClass("form-control");
    var newDate = $('<input/>').attr({ type: 'text', name: 'date', placeholder: 'Date', id: bookDateId + bookIdCounter }).addClass("form-control");
    $("#edit-book-form").append(br, newTitle, newAuthor, newPage, newDate, br);
};

Library.prototype.addAllBooks = function(newTitle, newAuthor, newPages, newPubDate) {
    var addedBooks = [];
    var loopCount = bookIdCounter;
    console.log(loopCount);
    for (var i = 0; i <= loopCount; i++){
        newBook = new Book(newTitle, newAuthor, newPages, newPubDate);
        newBook.title = $("#" + bookTitleId + i).val();
        newBook.author = $("#" + bookAuthorId + i).val();
        newBook.numberOfPages = $("#" + bookPageId + i).val();
        newBook.publishDate = new Date($("#" + bookDateId + i).val());
        addedBooks.push(newBook);
    };
    this.addBooks(addedBooks);
    this.storeLibrary();
    this.clearTopForm();
   
};

Library.prototype.makeNewBook = function(newTitle, newAuthor, newPages, newPubDate) {
    madeBook = new Book(newTitle, newAuthor, newPages, newPubDate);
    madeBook.title = $("#" + bookTitleId + bookIdCounter).val();
    madeBook.author = $("#" + bookAuthorId + bookIdCounter).val();
    madeBook.numberOfPages = $("#" + bookPageId + bookIdCounter).val();
    madeBook.publishDate = new Date($("#" + bookDateId + bookIdCounter).val());

    return madeBook;
}

Library.prototype.removeTitleHandler = function(oldTitle) {
    var oldTitle = $("#bookTitle0").val();

    this.removeBookByTitle(oldTitle);
    this.storeLibrary();
    this.clearTopForm();
};

Library.prototype.removeAuthorHandler = function() {
    var oldAuthor = $("#bookAuthor0").val();
    
    this.removeBooksByAuthor(oldAuthor);
    this.storeLibrary();
    this.clearTopForm();
};

Library.prototype.findTitleHandler = function(newTitle) {
    newTitle = $("#bookTitle0").val();
    var newTitlesArray = this.getBookByTitle(newTitle);
    
    if (newTitlesArray.length ===  0) {
        $("#display-results").append("There are no books in the library.");
    } else {
        for (i=0; i < newTitlesArray.length; i++) {
                $("#display-results").append( "<br />" +
                "Title: " + newTitlesArray[i].title + "<br />" +
                "Author: " + newTitlesArray[i].author +  "<br />" +
                "Pages: " + newTitlesArray[i].numberOfPages  +  "<br />" +
                "Publish Date: " + newTitlesArray[i].publishDate +  "<br />");
            };
    };
    this.clearTopForm();
};

Library.prototype.findAuthorHandler = function (newAuthor) {
    newAuthor = $("#bookAuthor0").val();
    var newAuthorsArray = this.getBooksByAuthor(newAuthor);
     if (newAuthorsArray.length ===  0) {
        $("#display-results").append ("There are no books in the library.");
    } else {
        for (i=0; i < newAuthorsArray.length; i++) {
            $("#display-results").append( "<br />" +
            "Title: " + newAuthorsArray[i].title + "<br />" +
            "Author: " + newAuthorsArray[i].author +  "<br />" +
            "Pages: " + newAuthorsArray[i].numberOfPages  +  "<br />" +
            "Publish Date: " + newAuthorsArray[i].publishDate + "<br />");
        };
    };
    this.clearTopForm();
};

Library.prototype.listAuthorsHandler = function() {
    $("#display-results").html("");
    var listAuthorsArray = this.getAuthors();
    if (listAuthorsArray.length ===  0) {
        $("#display-results").append("There are no books in the library.");
    } else {
        for(var i =0; i <listAuthorsArray.length; i++) {
            $("#display-results").append("Author: " + listAuthorsArray[i] + "<br />");
        }
        
    };
    this.clearTopForm();
};

Library.prototype.randomBookHandler = function() {
    $("#display-results").html("");
    var randBook = this.getRandomBook();
    if (randBook === null) {
        $("#display-results").append("There are no books in the library.");
    } else {
    $("#display-results").append(
        "Title: " + randBook.title + "<br />" +
        "Author: " + randBook.author +  "<br />" +
        "Pages: " + randBook.numberOfPages  +  "<br />" +
        "Publish Date: " + randBook.publishDate);
    };
    this.clearTopForm();
};

Library.prototype.randomAuthorHandler = function() {
    $("#display-results").html("");
    var randAuthor = this.getRandomAuthorName();
    if (randAuthor === null) {
        $("#display-results").append("There are no books in the library.");
    } else {  
        $("#display-results").append("Author: " + randAuthor);
    };
    this.clearTopForm();
};

$(function(){
    window.myLibrary = new Library();
    window.myLibrary.init();
});

