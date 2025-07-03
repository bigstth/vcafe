import { relations, sql } from 'drizzle-orm'
import { text, timestamp, primaryKey, integer, serial, pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core'
import { user } from './user-schema'

export const postVisibilityEnum = pgEnum('post_visibility', ['public', 'follower_only', 'membership_only'])

export const posts = pgTable('posts', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content'),
    visibility: postVisibilityEnum('visibility').default('public').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const comments = pgTable('comments', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    content: text('content').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    postId: uuid('post_id')
        .notNull()
        .references(() => posts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const followers = pgTable(
    'followers',
    {
        followerId: text('follower_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        followingId: text('following_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.followerId, table.followingId] }),
        }
    },
)

export const memberships = pgTable(
    'memberships',
    {
        memberId: text('member_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        creatorId: text('creator_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
        expiredAt: timestamp('expired_at').notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.memberId, table.creatorId] }),
        }
    },
)

export const postImages = pgTable('post_images', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    postId: uuid('post_id')
        .notNull()
        .references(() => posts.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    altText: text('alt_text'),
    displayOrder: integer('display_order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const postLikes = pgTable(
    'post_likes',
    {
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        postId: uuid('post_id')
            .notNull()
            .references(() => posts.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.postId] }),
        }
    },
)

export const commentLikes = pgTable(
    'comment_likes',
    {
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        commentId: uuid('comment_id')
            .notNull()
            .references(() => comments.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.commentId] }),
        }
    },
)

export const hashtags = pgTable('hashtags', {
    id: serial('id').primaryKey(),
    tag: text('tag').notNull().unique(),
})

export const postHashtags = pgTable(
    'post_hashtags',
    {
        postId: uuid('post_id')
            .notNull()
            .references(() => posts.id, { onDelete: 'cascade' }),
        hashtagId: integer('hashtag_id')
            .notNull()
            .references(() => hashtags.id, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.postId, table.hashtagId] }),
        }
    },
)

export const postMentions = pgTable(
    'post_mentions',
    {
        postId: uuid('post_id')
            .notNull()
            .references(() => posts.id, { onDelete: 'cascade' }),
        mentionedUserId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.postId, table.mentionedUserId] }),
        }
    },
)

export const userRelations = relations(user, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
    postLikes: many(postLikes),
    commentLikes: many(commentLikes),
    following: many(followers, { relationName: 'following' }),
    followers: many(followers, { relationName: 'followers' }),
    membershipsAsMember: many(memberships, { relationName: 'member' }),
    membershipsAsCreator: many(memberships, { relationName: 'creator' }),
}))

export const postRelations = relations(posts, ({ one, many }) => ({
    author: one(user, { fields: [posts.userId], references: [user.id] }),
    images: many(postImages),
    comments: many(comments),
    likes: many(postLikes),
    hashtags: many(postHashtags),
    mentions: many(postMentions),
}))

export const commentRelations = relations(comments, ({ one, many }) => ({
    author: one(user, { fields: [comments.userId], references: [user.id] }),
    post: one(posts, { fields: [comments.postId], references: [posts.id] }),
    likes: many(commentLikes),
}))

export const postImageRelations = relations(postImages, ({ one }) => ({
    post: one(posts, { fields: [postImages.postId], references: [posts.id] }),
}))

export const postLikesRelations = relations(postLikes, ({ one }) => ({
    post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
    user: one(user, { fields: [postLikes.userId], references: [user.id] }),
}))

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
    comment: one(comments, { fields: [commentLikes.commentId], references: [comments.id] }),
    user: one(user, { fields: [commentLikes.userId], references: [user.id] }),
}))

export const hashtagRelations = relations(hashtags, ({ many }) => ({
    postHashtags: many(postHashtags),
}))

export const postHashtagRelations = relations(postHashtags, ({ one }) => ({
    post: one(posts, { fields: [postHashtags.postId], references: [posts.id] }),
    hashtag: one(hashtags, { fields: [postHashtags.hashtagId], references: [hashtags.id] }),
}))

export const postMentionRelations = relations(postMentions, ({ one }) => ({
    post: one(posts, { fields: [postMentions.postId], references: [posts.id] }),
    mentionedUser: one(user, { fields: [postMentions.mentionedUserId], references: [user.id] }),
}))

export const followerRelations = relations(followers, ({ one }) => ({
    follower: one(user, { fields: [followers.followerId], references: [user.id], relationName: 'followers' }),
    following: one(user, { fields: [followers.followingId], references: [user.id], relationName: 'following' }),
}))

export const membershipRelations = relations(memberships, ({ one }) => ({
    member: one(user, { fields: [memberships.memberId], references: [user.id], relationName: 'member' }),
    creator: one(user, { fields: [memberships.creatorId], references: [user.id], relationName: 'creator' }),
}))
