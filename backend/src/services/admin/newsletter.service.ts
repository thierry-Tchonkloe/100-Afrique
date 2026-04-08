import { Prisma } from "@prisma/client";

import { prisma } from '../../config/database';

// export const getSubscribers = async (
//     page: number = 1,
//     pageSize: number = 10,
//     search?: string
// ) => {

//     const where = search
//         ? {
//             email: {
//             contains: search,
//             mode: "insensitive"
//             }
//         }
//         : {};

//     const total = await prisma.newsletterSubscriber.count({ where });

//     const subscribers = await prisma.newsletterSubscriber.findMany({
//         where,
//         orderBy: {
//         createdAt: "desc"
//         },
//         skip: (page - 1) * pageSize,
//         take: pageSize
//     });

//     return {
//         data: subscribers,
//         pagination: {
//         page,
//         pageSize,
//         total,
//         totalPages: Math.ceil(total / pageSize)
//         }
//     };
// };



export const getSubscribers = async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
) => {

    const where: Prisma.NewsletterSubscriberWhereInput = search
        ? {
            email: {
            contains: search,
            mode: "insensitive"
            }
        }
        : {};

    const total = await prisma.newsletterSubscriber.count({ where });

    const subscribers = await prisma.newsletterSubscriber.findMany({
        where,
        orderBy: {
        createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    return {
        data: subscribers,
        pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
        }
    };
};


export const getNewsletterStats = async () => {
    const total = await prisma.newsletterSubscriber.count();
    const last30Days = await prisma.newsletterSubscriber.count({
        where: {
        createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
        }
    });
    return {
        total,
        last30Days
    };
};




export const deleteSubscriber = async (id: number) => {
    await prisma.newsletterSubscriber.delete({
        where: { id }
    });
    return true;
};