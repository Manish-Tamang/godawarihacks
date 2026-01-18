export type NoteColor = "yellow" | "green" | "pink" | "blue" | "purple" | "orange";

export type StickyNoteConfig = {
    id: string;
    text: string;
    color: NoteColor;
    x: number;
    y: number;
    rotate: number;
};

export type ReviewTeam = {
    id: string;
    name: string;
    description: string;
    image: string;
    notes: StickyNoteConfig[];
};

export const REVIEW_DATA: ReviewTeam[] = [
    {
        id: "team-phoenix",
        name: "Team Phoenix",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "team-nellow",
        name: "Team Nellow",
        description: "Creative approach to the challenge.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Love the colors", color: "purple", x: 40, y: 30, rotate: 2 },
        ]
    },
    {
        id: "team-cache",
        name: "Team Cache",
        description: "Solving real world issues efficiently.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Impactful", color: "blue", x: 25, y: 40, rotate: -3 },
            { id: "2", text: "Clean code", color: "pink", x: 160, y: 70, rotate: 4 },
            { id: "3", text: "Great idea", color: "yellow", x: 40, y: 170, rotate: -2 },
            { id: "4", text: "User friendly", color: "green", x: 170, y: 210, rotate: 3 },
        ]
    },
    {
        id: "the-technicals",
        name: "The Technicals",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "team-gold",
        name: "Team Gold",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "the-will-of-d",
        name: "The Will of D",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "team-commit",
        name: "Team Commit",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "shree-bir-amar-singh",
        name: "Shree Bir Amar Singh",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "team-mechi",
        name: "Team Mechi",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    },
    {
        id: "team-greece",
        name: "Team Greece",
        description: "Innovative solution for modern problems.",
        image: "/hall.jpg",
        notes: [
            { id: "1", text: "Great UI!", color: "yellow", x: 20, y: 20, rotate: -5 },
            { id: "2", text: "Good API", color: "green", x: 150, y: 50, rotate: 3 },
            { id: "3", text: "Nice work", color: "pink", x: 30, y: 150, rotate: -2 },
            { id: "4", text: "Solid app", color: "blue", x: 160, y: 180, rotate: 4 },
        ]
    }
];
