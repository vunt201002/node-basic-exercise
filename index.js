import axios from 'axios';

let users = [];         // mảng user
let postData = [];      // mảng post
let cmtData = [];       // mảng comment

// hàm call api lấy post và comment
const fetchPostAndComment = async () => {
    try {
        const [postResponse, commentResponse] = await Promise.all([
            axios.get("https://jsonplaceholder.typicode.com/posts"),
            axios.get("https://jsonplaceholder.typicode.com/comments")
        ]);

        postData = postResponse.data;
        cmtData = commentResponse.data;

        // console.log(postData, cmtData);
    } catch (err) {
        console.log("Error when fetching post and comment");
    }
};

// 2. hàm get user
const fetchUser = async () => {
    try {
        const res = await axios.get("https://jsonplaceholder.typicode.com/users");
        const data = res.data;
        
        users = data.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            posts: [],  
            comments: []
        }));

        // console.log(users);

        return;
    } catch (err) {
        console.log("Error when fetching user");
    }
};

// 3. hàm map dữ liệu post và comment vào user
const assignPostsAndCmtToUser = () => {
    // lặp qua tất cả post
    postData.forEach(post => {
        // tìm index của user có id bằng userId trong post
        const userIdx = users.findIndex(user => user.id === post.userId);

        if (userIdx !== -1) {
            // thêm post
            users[userIdx].posts.push({ id: post.id });
        }
    });

    // lặp qua comment
    cmtData.forEach(cmt => {
        // tìm index của user, tìm trong các post của
        // user có postId bằng với postId của mỗi comment
        const userIdx = users.findIndex(user => user.posts.some(post => post.id === cmt.postId));

        if (userIdx !== -1) {
            // thêm comment
            users[userIdx].comments.push(`commet id: ${cmt.id}`);
        }
    });

    // console.log(users);
};

// 4. Lọc ra các user có nhiều hơn 3 comment
const filterUserWithMoreThanThreeCmt = () => {
    const filterUser = users.filter(user => user.comments.length > 3);
    
    console.log(filterUser);
};

// 5. format lại user, tính số post và comment
const reformatUsersWithCount = () => {
    users = users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        commentsCount: user.comments.length,  
        postsCount: user.posts.length
    }));
};

// 6.1: User nhiều post nhất
const userWithMostPosts = () => {

    // fake postCount
    users[0].postsCount = 23;
    users[1].postsCount = 25;
    users[5].postsCount = 48;
    users[3].postsCount = 37;

    const u = users.reduce((mostUser, currentUser) => {
        return currentUser.postsCount > mostUser.postsCount ? currentUser : mostUser;
    }, users[0]);

    console.log(u);
}

// 6.2: User nhiều comment nhất
const userWithMostComments = () => {
    // fake commentsCount
    users[0].commentsCount = 203;
    users[1].commentsCount = 25;
    users[5].commentsCount = 48;
    users[3].commentsCount = 37;

    const u = users.reduce((mostUser, currentUser) => {
        return currentUser.commentsCount > mostUser.commentsCount ? currentUser : mostUser;
    }, users[0]);

    console.log(u);
}

// 7. Sắp xếp user giảm dần dựa trên số post
const sortByPostsCount = () => {
    // fake postCount
    users[0].postsCount = 23;
    users[1].postsCount = 25;
    users[5].postsCount = 48;
    users[3].postsCount = 37;


    const sorted = users.sort((a, b) => b.postsCount - a.postsCount);

    console.log(sorted);
}

// 8. Call api post và comment, merge dữ liệu
const mergePostAndComment = async () => {
    try {
        const [postResponse, commentResponse] = await Promise.all([
            axios.get("https://jsonplaceholder.typicode.com/posts/1"),
            axios.get("https://jsonplaceholder.typicode.com/posts/1/comments")
        ]);

        const post = postResponse.data;
        const comments = commentResponse.data;

        post.comments = [];
        comments.forEach(c => {
            post.comments.push(c);
        })

        console.log(post);
    } catch (err) {
        console.log("Error when merge post and comment");
    }
};

// 2. Get data from user api
await fetchUser();
// console.log(users);

// 3. Get post, comment and map data
await fetchPostAndComment();
assignPostsAndCmtToUser();
// console.log(users);

// 4. Filter user
// filterUserWithMoreThanThreeCmt();

// 5. Reformat data
reformatUsersWithCount();
// console.log(users);

// 6. User with most post, comment
// userWithMostPosts();
// userWithMostComments();

// 7. sort
// sortByPostsCount();

// 8. Get post, comment and merge
// mergePostAndComment();