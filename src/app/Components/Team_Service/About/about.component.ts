import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

interface TeamMember {
  name: string;
  employeeNumber: string;
  jobTitle: string;
  bio: string;
  socialLinks: SocialLink[];
}

interface SocialLink {
  icon: string;
  url: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  teamMembers: TeamMember[] = [];
  isDarkTheme: boolean = false;
  private themeSubscription!: Subscription;

  // Color palette for avatar backgrounds
  private avatarColors = [
    '#4a6cfa', '#dc3545', '#28a745', '#ffc107', 
    '#6c757d', '#5c7cfa', '#ef4444', '#10b981'
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.loadTeamMembers();
    
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.themeChanged.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    // Set initial theme state
    this.isDarkTheme = this.themeService.isDarkTheme();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(member: TeamMember): string {
    // Generate a consistent color based on the member's name
    const charSum = member.name
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    return this.avatarColors[charSum % this.avatarColors.length];
  }

  loadTeamMembers(): void {
    this.teamMembers = [
      {
        name: 'Abd EL-Rahman Khalaf',
        employeeNumber: 'SID-23011109',
        jobTitle: 'Full Stack Developer',
        bio: 'A Full Stack Developer specializing in the .NET framework and a Data Science student at the Faculty of Computer Science, Alexandria University. I have a strong passion for building efficient and scalable web applications. With expertise in both front-end and back-end technologies, I enjoy creating seamless user experiences and robust server-side solutions. My academic background in data science also equips me with analytical skills that enhance my development work.',
        socialLinks: [
          { icon: 'linkedin', url: 'https://www.linkedin.com/in/abd-el-rahman-khalaf-81063a30b' },
          { icon: 'github', url: 'https://github.com/Abdelrahman2264' }
        ]
      },
      {
        name: 'Abd EL-Rahman Ali',
        employeeNumber: 'SID-220100176',
        jobTitle: 'AI/ML Engineer',
        bio: 'An AI Engineer with expertise in designing and deploying intelligent systems powered by machine learning, deep learning, NLP, and computer vision. Passionate about transforming complex problems into scalable, data-driven solutions that create real-world impact. Skilled in Python, TensorFlow, PyTorch, and cloud platforms, with a strong foundation in mathematics, algorithms, and data science.',
        socialLinks: [
          { icon: 'github', url: 'https://github.com/Hadaba-eddition' },
          { icon: 'linkedin', url: 'https://www.linkedin.com/in/apdalrahman-ali-a796b835a' }
        ]
      },
      {
        name: 'Mohamed Ayman',
        employeeNumber: 'SID-23011464',
        jobTitle: 'Frontend Developer',
        bio: 'A skilled Frontend Developer with a passion for creating engaging and user-friendly web interfaces. He specializes in HTML, CSS, and JavaScript, and has experience working with popular frameworks like Angular and React. Mohamed is dedicated to staying up-to-date with the latest web technologies and trends to deliver modern and responsive designs.',
        socialLinks: [
          { icon: 'github', url: 'https://www.github.com' },
          { icon: 'linkedin', url: 'https://www.linkedin.com' }
        ]
      },
      {
        name: 'Esraa EL-Sayed',
        employeeNumber: 'SID-23011040',
        jobTitle: 'Ai/ML Developer',
        bio: 'An AI/ML Developer with a strong background in machine learning, deep learning, and data analysis. She is proficient in Python and has experience working with libraries such as TensorFlow, Keras, and Scikit-learn. Esraa is passionate about leveraging AI technologies to solve complex problems and improve business processes.',
        socialLinks: [
          { icon: 'github', url: 'https://github.com' },
          {icon: 'linkedin', url: 'https://www.linkedin.com'}
        ]
      },
      {
        name: 'Shrouk Shaban',
        employeeNumber: 'SID-23011088',
        jobTitle: 'Flutter Developer',
        bio: 'A talented Flutter Developer with expertise in building cross-platform mobile applications. She has a strong command of Dart and the Flutter framework, allowing her to create visually appealing and high-performance apps for both iOS and Android. Shrouk is committed to delivering seamless user experiences and continuously improving her skills in mobile development.',
        socialLinks: [
            { icon: 'github', url: 'https://github.com' },
          {icon: 'linkedin', url: 'https://www.linkedin.com'}
        ]
      }
    ];
  }
}