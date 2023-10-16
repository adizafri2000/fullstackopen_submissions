const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length===0
        ? blogs[0].likes
        : blogs.reduce(reducer,0)
}

const favouriteBlog = (blogs) => {
    let mostLikes = blogs[0]
    for (const blog of blogs){
        if(blog.likes > mostLikes.likes)
            mostLikes = blog
    }

    return {
        title: mostLikes.title,
        author: mostLikes.author,
        likes: mostLikes.likes
    }
}

const mostBlogs = (blogs) => {

    var authorList = []
    var totalBlogList = []

    for (const blog of blogs){
        if (!authorList.includes(blog.author)){
            authorList.push(blog.author)
            totalBlogList.push(1)
        }
        else{
            const index = authorList.indexOf(blog.author)
            totalBlogList[index] += 1
        }
    }

    const maxLikesIndex = totalBlogList.indexOf(Math.max(...totalBlogList))

    return {
        author: authorList[maxLikesIndex],
        blogs: totalBlogList[maxLikesIndex]
    }
}

const mostLikes = (blogs) => {

    var authorList = []
    var likesList = []

    for (const blog of blogs){
        if (!authorList.includes(blog.author)){
            authorList.push(blog.author)
            likesList.push(blog.likes)
        }
        else{
            const index = authorList.indexOf(blog.author)
            likesList[index] += blog.likes
        }
    }

    const maxLikesIndex = likesList.indexOf(Math.max(...likesList))

    return {
        author: authorList[maxLikesIndex],
        likes: likesList[maxLikesIndex]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}