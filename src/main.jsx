import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, GitBranch, Boxes, Rocket, Server, Activity, Lock, Database, Workflow, ExternalLink, CheckCircle2, AlertTriangle, BookOpen, HelpCircle, Container, Gauge } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './styles.css';

const project = {
  name: 'DEPI DevSecOps Project — MIND Notes App',
  tagline: 'GitHub → Jenkins → Gitleaks → SonarQube → Docker Build → Trivy → DockerHub → ArgoCD → K3s Kubernetes',
  summary: 'A complete DevSecOps workflow deployed on AWS EC2 using Jenkins CI, Docker images, security scanning, DockerHub registry, K3s Kubernetes, and ArgoCD GitOps self-healing.',
  liveServices: [
    { service: 'GitHub Repository', url: 'https://github.com/fadyy2k/depi-mind-app-v2', access: 'Public' },
    { service: 'MkDocs Site', url: 'https://fadyy2k.github.io/depi-mind-app-v2/', access: 'Public' },
    { service: 'Jenkins', url: 'http://depi-jenkins-depi.duckdns.org:8080', access: 'No login required' },
    { service: 'MIND App', url: 'http://depi-k3s-depi.duckdns.org:30080', access: 'demo@example.com / demo123456' },
    { service: 'API Health', url: 'http://depi-k3s-depi.duckdns.org:30080/api/health', access: 'Public health endpoint' },
    { service: 'ArgoCD', url: 'http://depi-k3s-depi.duckdns.org:32000', access: 'Admin login available during live demo only' },
    { service: 'SonarQube', url: 'http://depi-jenkins-depi.duckdns.org:9000', access: 'Admin login available during live demo only' },
    { service: 'DockerHub Backend', url: 'https://hub.docker.com/r/fadyy2k/mind-backend', access: 'Public image repository' },
    { service: 'DockerHub Frontend', url: 'https://hub.docker.com/r/fadyy2k/mind-frontend', access: 'Public image repository' }
  ],
  infrastructure: [
    { name: 'depi-jenkins-server', role: 'CI, Docker builds, Gitleaks, SonarQube, Trivy, DockerHub push', public: 'depi-jenkins-depi.duckdns.org', ports: '8080, 9000' },
    { name: 'depi-k3s-server', role: 'K3s Kubernetes, ArgoCD, MIND App runtime', public: 'depi-k3s-depi.duckdns.org', ports: '30080, 32000, 6443' }
  ],
  stack: [
    ['Frontend','React + Nginx','Running'], ['Backend','Go API','Running'], ['Database','PostgreSQL 15','Running'], ['CI','Jenkins','Running'], ['Secret Scan','Gitleaks','No leaks found'], ['Code Quality','SonarQube','Quality gate passed'], ['Image Scan','Trivy','Report-only mode'], ['Registry','DockerHub','Images pushed'], ['Kubernetes','K3s','Ready'], ['GitOps','ArgoCD','Synced / Healthy'], ['DNS','DuckDNS','Dynamic demo URLs']
  ],
  pipelineStages: [
    ['Checkout','GitHub','Pull source code from repository'], ['Show Workspace','Jenkins','Validate workspace and folder structure'], ['Gitleaks Secret Scan','Gitleaks','Detect leaked secrets before build'], ['SonarQube Code Scan','SonarQube','Analyze code quality and maintainability'], ['Build Backend Image','Docker','Build Go backend image'], ['Build Frontend Image','Docker','Build React/Nginx frontend image'], ['Trivy Image Scan','Trivy','Scan Docker images for vulnerabilities'], ['DockerHub Login','DockerHub','Authenticate using Jenkins credentials'], ['Push Images','DockerHub','Push versioned and latest image tags']
  ],
  k8sResources: [
    ['Namespace','mind',1], ['Secret','postgres-secret',1], ['PVC','postgres-pvc',1], ['Deployment','postgres',1], ['Deployment','mind-backend',1], ['Deployment','mind-frontend',1], ['Service','postgres',1], ['Service','backend-service',1], ['Service','mind-frontend-service',1]
  ],
  validation: [
    ['K3s node','Ready'], ['Backend pod','1/1 Running'], ['Frontend pod','1/1 Running'], ['PostgreSQL pod','1/1 Running'], ['ArgoCD app','Synced / Healthy'], ['API health','200 OK'], ['Gitleaks','No leaks found'], ['SonarQube','Analysis successful / Quality gate passed']
  ],
  screenshots: ['GitHub repository with README and docs','MkDocs GitHub Pages website','Jenkins dashboard','Jenkins Build #8 success','Jenkins Gitleaks console output','Jenkins SonarQube console output','Jenkins Trivy console output','DockerHub backend tags','DockerHub frontend tags','K3s pods and services','MIND App running','API health endpoint','ArgoCD synced/healthy tree','ArgoCD self-healing proof','SonarQube dashboard'],
  qa: [
    ['What is the main goal of the project?','To demonstrate a full DevSecOps delivery pipeline from source code to production-like Kubernetes deployment, including CI, security scanning, image publishing, GitOps deployment, and self-healing validation.'],
    ['Why did you use Jenkins?','Jenkins was used as the CI automation server to pull code, run security/code-quality scans, build Docker images, and push images to DockerHub.'],
    ['Why did you use Gitleaks?','Gitleaks checks the repository for accidentally committed secrets before the application is built or deployed.'],
    ['Why did you use SonarQube?','SonarQube provides static code analysis, maintainability feedback, reliability checks, and quality gate visibility.'],
    ['Why is Trivy in report-only mode?','For the demo, Trivy shows vulnerability visibility without blocking the pipeline. In production, the same stage can be changed to fail the build on HIGH or CRITICAL findings.'],
    ['Why did you use DockerHub?','DockerHub acts as the image registry where versioned backend and frontend images are stored and pulled by Kubernetes.'],
    ['Why K3s instead of full Kubernetes or EKS?','K3s is lightweight and suitable for a cost-effective single-node lab on EC2 while still demonstrating real Kubernetes concepts.'],
    ['What does ArgoCD add?','ArgoCD continuously syncs Kubernetes manifests from Git and restores the desired state if manual drift occurs.'],
    ['How did you prove self-healing?','The frontend deployment was manually scaled to zero replicas. ArgoCD detected the drift and restored the deployment back to the Git-defined desired state.'],
    ['What would you improve for production?','Use managed PostgreSQL, private subnets, HTTPS with a real domain, stronger secrets management, non-default admin users, production SonarQube database, stricter Trivy gates, monitoring/alerting, backups, and multi-node Kubernetes.']
  ]
};

const buildDuration = [{ build: '#3', seconds: 39 }, { build: '#5', seconds: 65 }, { build: '#8', seconds: 88 }];
const scanResults = [{ name: 'Gitleaks', value: 0 }, { name: 'SonarQube', value: 1 }, { name: 'Trivy Backend', value: 15 }, { name: 'Trivy Frontend', value: 1 }];
const toolCoverage = ['CI','Secret Scan','Code Quality','Image Scan','Registry','Kubernetes','GitOps','Docs'].map(name => ({name, value:1}));
const resourcesChart = project.k8sResources.map(([type,,count]) => ({ name: type, count }));
const COLORS = ['#60a5fa', '#22c55e', '#a78bfa', '#f97316', '#14b8a6', '#eab308', '#f43f5e', '#38bdf8'];

function Section({ id, title, icon: Icon, children }) { return <section id={id} className="section"><div className="section-title"><Icon size={24}/><h2>{title}</h2></div>{children}</section>; }
function Card({ children, className='' }) { return <div className={`card ${className}`}>{children}</div>; }
function ExternalAnchor({ href, children }) { return <a href={href} target="_blank" rel="noreferrer" className="link">{children}<ExternalLink size={14}/></a>; }

function App() {
  const [query, setQuery] = useState('');
  const filteredQA = useMemo(() => project.qa.filter(([q,a]) => (q + ' ' + a).toLowerCase().includes(query.toLowerCase())), [query]);
  return <main>
    <header className="hero"><div className="hero-glow"/><nav className="nav"><div className="brand"><div className="brand-icon">Δ</div><span>DEPI DevSecOps</span></div><div className="nav-links"><a href="#architecture">Architecture</a><a href="#pipeline">Pipeline</a><a href="#security">Security</a><a href="#qa">Professor Q&A</a></div></nav>
      <div className="hero-content"><div><p className="eyebrow">AWS • Jenkins • Kubernetes • GitOps • DevSecOps</p><h1>{project.name}</h1><p className="summary">{project.summary}</p><div className="hero-actions"><ExternalAnchor href="https://github.com/fadyy2k/depi-mind-app-v2">GitHub Repo</ExternalAnchor><ExternalAnchor href="https://fadyy2k.github.io/depi-mind-app-v2/">MkDocs Site</ExternalAnchor><ExternalAnchor href="http://depi-k3s-depi.duckdns.org:30080">Live App</ExternalAnchor></div></div><Card className="toolchain-card"><h3>Final Toolchain</h3><p>{project.tagline}</p><div className="chips">{['GitHub','Jenkins','Gitleaks','SonarQube','Docker','Trivy','DockerHub','ArgoCD','K3s'].map(x=><span key={x}>{x}</span>)}</div></Card></div>
    </header>
    <Section id="overview" title="Project Overview" icon={BookOpen}><div className="grid three">{[["Frontend","React app served by Nginx",Rocket],["Backend","Go API with health endpoint",Server],["Database","PostgreSQL with PVC persistence",Database]].map(([t,txt,Icon])=><Card key={t}><Icon className="card-icon"/><h3>{t}</h3><p>{txt}</p></Card>)}</div><Card><h3>Live Services</h3><div className="table"><div className="tr head"><span>Service</span><span>URL</span><span>Access</span></div>{project.liveServices.map(r=><div className="tr" key={r.service}><strong>{r.service}</strong><ExternalAnchor href={r.url}>{r.url}</ExternalAnchor><span>{r.access}</span></div>)}</div><p className="note">Security note: do not publish real admin passwords, private keys, tokens, or cloud credentials in a public repository or public Vercel app.</p></Card></Section>
    <Section id="architecture" title="Architecture & Infrastructure" icon={Workflow}><Card><div className="flow">{['GitHub','Jenkins','Gitleaks','SonarQube','Docker Build','Trivy','DockerHub','ArgoCD','K3s','MIND App'].map((n,i)=><React.Fragment key={n}><div className="flow-node">{n}</div>{i<9&&<div className="arrow">→</div>}</React.Fragment>)}</div></Card><div className="grid two">{project.infrastructure.map(s=><Card key={s.name}><Server className="card-icon"/><h3>{s.name}</h3><p>{s.role}</p><div className="kv"><span>Public DNS</span><strong>{s.public}</strong></div><div className="kv"><span>Ports</span><strong>{s.ports}</strong></div></Card>)}</div><Card><h3>Application Stack</h3><div className="stack-grid">{project.stack.map(([l,t,st])=><div className="stack-item" key={l}><span>{l}</span><strong>{t}</strong><em>{st}</em></div>)}</div></Card></Section>
    <Section id="pipeline" title="CI/CD Pipeline" icon={GitBranch}><div className="timeline">{project.pipelineStages.map(([stage,tool,purpose],i)=><div className="timeline-item" key={stage}><div className="step">{i+1}</div><Card><h3>{stage}</h3><p><strong>{tool}</strong> — {purpose}</p></Card></div>)}</div><div className="grid two"><Card><h3>Build Duration Trend</h3><ResponsiveContainer width="100%" height={260}><LineChart data={buildDuration}><CartesianGrid strokeDasharray="3 3" opacity={0.2}/><XAxis dataKey="build"/><YAxis/><Tooltip/><Line type="monotone" dataKey="seconds" strokeWidth={3}/></LineChart></ResponsiveContainer></Card><Card><h3>DevSecOps Coverage</h3><ResponsiveContainer width="100%" height={260}><AreaChart data={toolCoverage}><CartesianGrid strokeDasharray="3 3" opacity={0.2}/><XAxis dataKey="name"/><YAxis hide domain={[0,1]}/><Tooltip/><Area type="monotone" dataKey="value" strokeWidth={3}/></AreaChart></ResponsiveContainer></Card></div></Section>
    <Section id="security" title="Security & Quality Gates" icon={ShieldCheck}><div className="grid three"><Card><Lock className="card-icon"/><h3>Gitleaks</h3><p>Pre-build secret detection. Latest proof: no leaks found.</p></Card><Card><Gauge className="card-icon"/><h3>SonarQube</h3><p>Static code analysis completed successfully. Quality gate passed.</p></Card><Card><Container className="card-icon"/><h3>Trivy</h3><p>Docker image vulnerability scanning in report-only mode.</p></Card></div><Card><h3>Security Scan Results</h3><ResponsiveContainer width="100%" height={300}><BarChart data={scanResults}><CartesianGrid strokeDasharray="3 3" opacity={0.2}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></Card></Section>
    <Section id="kubernetes" title="Kubernetes & GitOps" icon={Boxes}><div className="grid two"><Card><h3>Kubernetes Resources</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={resourcesChart} dataKey="count" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>{resourcesChart.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></Card><Card><h3>Final Validation</h3><div className="checks">{project.validation.map(([c,r])=><div className="check" key={c}><CheckCircle2 size={18}/><span>{c}</span><strong>{r}</strong></div>)}</div></Card></div><Card><h3>ArgoCD Self-Healing Proof</h3><p>Manual drift was created by scaling the frontend deployment to zero replicas. ArgoCD detected the live-state drift and restored the deployment automatically.</p><pre>{`kubectl scale deployment mind-frontend -n mind --replicas=0\n# After ArgoCD self-heal:\nmind-frontend: 1/1 Running\nmind-app: Synced / Healthy`}</pre></Card></Section>
    <Section id="evidence" title="Evidence & Screenshots Checklist" icon={Activity}><Card><div className="evidence-grid">{project.screenshots.map(s=><div className="evidence" key={s}><CheckCircle2 size={18}/><span>{s}</span></div>)}</div><p className="note">Optional next step: add your actual screenshots under public/screenshots/ and link them from this section.</p></Card></Section>
    <Section id="qa" title="Professor Q&A" icon={HelpCircle}><Card><input className="search" placeholder="Search: ArgoCD, Trivy, SonarQube, Kubernetes..." value={query} onChange={e=>setQuery(e.target.value)}/></Card><div className="qa-list">{filteredQA.map(([q,a])=><Card key={q}><h3>{q}</h3><p>{a}</p></Card>)}</div></Section>
    <footer><AlertTriangle size={18}/><span>Demo credentials and tokens must stay private. Use this app as a presentation and documentation portal, not a secrets store.</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
