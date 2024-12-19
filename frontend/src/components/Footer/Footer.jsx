const Footer = () => {
  // Ensure teamMembers is always defined as an array
  const teamMembers =
    [
      {
        name: "Mannu Jha",
        role: "Project Manager",
        info: "Specialized in DataStructure and Algorithms",
        isHead: true,
      },
      {
        name: "Sumit Kumar",
        role: "FullStack Developer",
        info: "Expert in Node.js and React.",
        isHead: false,
      },
      {
        name: "Vikas Kumar",
        role: "FullStack Developer",
        info: "Specialized in Node.js and Database",
        isHead: false,
      },
      {
        name: "Yashika Solanki",
        role: "Designer",
        info: "Creates stunning user interfaces And Presentation",
        isHead: false,
      },
    ] ; // Ensure it's always an array

  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="team-title">Meet Our Team</h2>
        <div className="team-list">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <div className="member-info">
                <p className="member-name">{member.name}</p>
                <p className="member-role">
                  {member.role}{" "}
                  {member.isHead && <span className="head"> - Head</span>}
                </p>
                <p>{member.info}</p>
                {member.isHead && <div className="head-badge">Team Head</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">© 2024 Team. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
