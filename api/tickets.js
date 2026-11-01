export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerName, deviceType, issueDescription } = req.body;
    const githubToken = process.env.GITHUB_TICKET_TOKEN;

    const GITHUB_USERNAME = "xaal11032001";
    const REPO_NAME = "potters-bar-tech";

    if (!githubToken) {
      return res.status(500).json({ error: 'Missing configuration on Vercel' });
    }

    const title = `New Repair Ticket: ${deviceType} for ${customerName}`;
    const escapedIssueDescription = issueDescription.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    const body = `**Customer Name:** ${customerName}\n**Device Type:** ${deviceType}\n**Issue Description:**\n${escapedIssueDescription}`;

    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub API Error:', data);
      return res.status(response.status).json({ success: false, error: data.message });
    }

    return res.status(200).json({ success: true, issueUrl: data.html_url });
  } catch (error) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
