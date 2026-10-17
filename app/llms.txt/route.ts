import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Godawari Hacks

> A student-driven 24-hour hackathon organized by students of Sushma Godawari College, Itahari, Nepal.

## About

Godawari Hacks is the biggest highschool hackathon in Koshi Province, Nepal. It brings together 30+ teams of passionate students for an epic 24-hour coding marathon at Sushma Godawari College.

## Key Information

- Event: Godawari Hacks
- Duration: 24 hours
- Location: Sushma Godawari College, Itahari-6, Sunsari, Nepal
- Dates: 18th - 19th January 2026
- Organized by: Students of Sushma Godawari College (+2 Students)
- Website: https://hack.godawari.edu.np

## Prize Pool

- Winner: Rs. 60,000 Worth
- Second: Rs. 30,000 Worth
- Third: Rs. 10,000 Worth
- All Participants: Coding Stickers
- Total: Over NRs. 1,00,000

## Pages

- Home: https://hack.godawari.edu.np
- About: https://hack.godawari.edu.np/about
- Blog: https://hack.godawari.edu.np/blog
- Contact: https://hack.godawari.edu.np/contact
- Register: https://hack.godawari.edu.np/register

## Partners

- Sushma Godawari College
- Connect Club (Sushma Godawari College)
- Sushma Leaders Alliance

## Contact

For sponsorship or general inquiries, visit: https://hack.godawari.edu.np/contact
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
