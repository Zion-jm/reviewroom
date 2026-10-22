// Transcribed concepts and diagram labels from the supplied class materials.
// Definitions are paraphrased; identifiers follow source order and must remain stable.
export const termGroups=[];
const group=(lessonId,topic,ref,rows)=>termGroups.push({lessonId,topic,ref,rows:rows.trim().split('\n').map(r=>r.split('|'))});
group('lesson-1','Computing foundations','Slides 3–11',`
Hardware|The physical components of a computer that can be installed, repaired, or replaced.
Microprocessor|A processor implemented on a small integrated-circuit chip that executes instructions and calculations.
Internet|The global system of interconnected computer networks used to exchange information.
Mobile computing|Using portable devices to exchange data, voice, or video without a fixed physical connection.
Artificial intelligence (AI)|Computer capabilities for tasks such as learning, reasoning, and problem solving.
CPU (Central Processing Unit)|The main processor that executes program instructions and coordinates calculations and data operations.
Computer program|A set of instructions that tells a computer how to perform a task.
CPU core|An individual processing unit within a processor; several can execute work concurrently.
Multitasking|Running or managing multiple tasks during the same period.
Hardware servicing|Maintaining, diagnosing, repairing, or upgrading physical computer components.
`);
group('lesson-1','Processor and motherboard','Slides 13–17',`
Core clock|The processor operating frequency listed separately from its boost frequency in the CPU comparison table.
Boost clock|A higher processor frequency that may be reached when operating conditions permit.
Gigahertz (GHz)|A frequency unit equal to one billion cycles per second, used for processor clock rates.
Motherboard|The main circuit board connecting the processor, memory, storage, and peripheral interfaces.
Bus|A communication pathway that transfers data or signals between computer components.
Expansion slot|A motherboard connector used to install an additional adapter or expansion card.
CPU socket|The motherboard mounting interface that physically and electrically connects a compatible processor.
BIOS (Basic Input/Output System)|Legacy firmware that initializes hardware and starts the boot process.
UEFI (Unified Extensible Firmware Interface)|The modern firmware interface used to initialize hardware and start an operating system.
Firmware|Low-level software stored in a device that controls its basic operation.
Booting|The startup process that initializes hardware and loads the operating system.
Form factor|A hardware size and layout standard that affects physical compatibility.
Mini-ITX|The compact motherboard format shown smaller than Micro ATX in the size comparison.
Micro ATX|The motherboard format shown between Mini-ITX and ATX in the size comparison.
ATX|The standard full-size desktop motherboard format shown between Micro ATX and E-ATX.
E-ATX (Extended ATX)|The larger motherboard format shown to the right of ATX in the size comparison; case compatibility must be checked.
`);
group('lesson-1','Memory','Slides 18–25 (including image tables)',`
RAM (Random Access Memory)|Working memory holding data and instructions currently needed by running programs.
Volatile memory|Memory whose contents are lost when power is removed.
DIMM (Dual In-line Memory Module)|The full-size memory module format commonly fitted in desktop memory slots.
SO-DIMM (Small Outline DIMM)|The shorter memory module format commonly used in laptops and compact computers.
MicroDIMM|A small memory module format shown separately from DIMM and SO-DIMM in the slide.
DIMM slot|The motherboard socket in which a compatible memory module is installed.
DRAM (Dynamic Random Access Memory)|A type of working memory that requires periodic refresh to retain its data while powered.
DDR (Double Data Rate)|The memory technology that transfers data on both edges of a clock signal; also the first DDR generation in the comparison.
DDR2|The second DDR memory generation, distinct from DDR, DDR3, DDR4, and DDR5.
DDR3|The third DDR memory generation, shown between DDR2 and DDR4 in the comparison.
DDR4|The fourth DDR memory generation, preceding DDR5 in the comparison.
DDR5|The fifth DDR memory generation shown as the newest column in the supplied comparison.
Prefetch|The amount of data fetched internally per memory operation to support external transfers.
Data rate (MT/s)|The number of millions of data transfers performed per second by a memory interface.
Transfer bandwidth (GB/s)|The amount of data transferred per second, expressed in billions of bytes per second.
Voltage (V)|Electrical potential difference; memory and other components must use compatible electrical specifications.
Memory compatibility|Matching memory generation, module format, and supported specifications to the motherboard or laptop.
`);
group('lesson-1','Storage','Slides 8, 26–30',`
Storage|Hardware that retains files and programs when the computer is powered off.
HDD (Hard Disk Drive)|A storage device that reads and writes data on spinning magnetic platters.
SSD (Solid State Drive)|A storage device that uses flash memory without moving mechanical parts.
Flash memory|Nonvolatile electronic memory used to retain data in solid-state drives.
Magnetic platter|A rotating disk surface inside an HDD on which data is recorded magnetically.
SATA (Serial ATA)|A storage connection standard used by the SATA HDD and SATA SSD pictured in the slide.
NVMe (Non-Volatile Memory Express)|A storage access protocol designed for nonvolatile storage over PCI Express.
M.2|A compact card form factor used by the pictured SATA and NVMe SSDs; shape alone does not identify the storage protocol.
M.2 SATA SSD|A compact M.2 solid-state drive that communicates using SATA.
M.2 NVMe SSD|A compact M.2 solid-state drive that uses NVMe over PCI Express.
3.5-inch drive|The larger common HDD size shown in the hard-drive image, typically used in desktops.
2.5-inch drive|The smaller common drive size shown beside 3.5-inch HDDs, often used in laptops or compact bays.
Optical drive|A device that reads or writes optical discs using a laser.
DVD drive|An optical drive designed to read, and in writable models record, DVD discs.
Floppy drive|A legacy storage device used to read or write removable magnetic floppy disks.
`);
group('lesson-1','Power','Slides 8, 31–37',`
PSU (Power Supply Unit)|The component that converts wall power into the low-voltage DC supplies used by computer hardware.
SMPS (Switched-Mode Power Supply)|A power supply using rapid electronic switching to convert and regulate electrical power efficiently.
Alternating current (AC)|Electrical current that periodically reverses direction, as supplied by the wall outlet.
Direct current (DC)|Electrical current that flows in one direction, used by internal computer components.
Watt (W)|The unit of electrical power used to express PSU capacity, such as 550 W or 750 W.
80 PLUS|An efficiency certification scheme for power supplies, not a rating of their total wattage.
80 PLUS Bronze|An efficiency tier listed below Silver, Gold, and Platinum in the lesson's set of PSU ratings.
80 PLUS Silver|The PSU efficiency tier listed between Bronze and Gold.
80 PLUS Gold|The PSU efficiency tier listed between Silver and Platinum.
80 PLUS Platinum|The highest of the four named PSU efficiency tiers in this lesson.
Non-modular PSU|A power supply whose cables are permanently attached.
Semi-modular PSU|A power supply with some fixed cables and some detachable cables.
Fully modular PSU|A power supply whose external component cables are detachable.
24-pin P1 connector|The main motherboard power connector illustrated in the power-supply cable diagram.
4-pin auxiliary power connector|The smaller auxiliary motherboard power plug shown for supplying processor power.
8-pin auxiliary power connector|The larger auxiliary motherboard power plug shown for supplying processor power.
6-pin PCIe power connector|The six-contact auxiliary power plug shown for compatible graphics cards.
8-pin PCIe power connector|The eight-contact auxiliary power plug shown for compatible graphics cards; it is not interchangeable with an 8-pin CPU power plug.
4-pin Molex connector|The legacy peripheral power plug shown for devices such as older drives.
SATA power connector|The flat power connector supplying compatible SATA storage devices, separate from their data cable.
Floppy power connector|The small legacy power plug pictured for floppy disk drives.
COM / ground|The common electrical return shown on black wires in the power connector diagram.
PS_ON#|The power-supply control signal that requests the main outputs to turn on when asserted low.
PWR_OK / power good|A PSU signal indicating that its main output voltages are within acceptable operating limits.
+5VSB|The five-volt standby supply shown in the connector diagram, available while the PSU has appropriate input power.
NC (Not Connected)|A connector position marked as having no electrical connection in the pinout.
Power rail|A specified PSU output voltage, such as +3.3 V, +5 V, or +12 V, used by computer components.
`);
group('lesson-1','Graphics, cooling and peripherals','Slides 38–44, 52',`
GPU (Graphics Processing Unit)|A processor specialized for producing graphics, images, video, and related parallel computations.
Integrated graphics|Graphics processing built into a processor or platform rather than provided by a separate graphics card.
Dedicated graphics card|A separate expansion card providing its own graphics processor for demanding visual workloads.
3D rendering|Computing a two-dimensional image from a three-dimensional scene.
Heatsink|A component that spreads and dissipates heat away from a hot chip.
CPU fan|A fan that moves air through or around the processor's heatsink.
Case fan|A fan that circulates air through the computer enclosure.
Liquid cooling|A cooling method that transfers component heat through a circulating liquid to a radiator.
Airflow|The movement of air through a system to carry heat away from components.
Input device|A peripheral that sends user information or signals into a computer.
Output device|A peripheral that presents processed information to a user.
Keyboard|An input device used to enter characters and commands by pressing keys.
Mouse|A pointing input device used to move a cursor and select items.
Microphone|An input device that converts sound into signals for a computer.
Scanner|An input device that converts a physical document or image into digital data.
Monitor|An output device that displays visual information on a screen.
Speaker|An output device that produces sound for listeners in the surrounding space.
Headphones|An audio output device worn on or around the ears.
Printer|An output device that produces a physical copy of digital information.
Computer case / cabinet|The enclosure that houses and supports the computer's internal components.
Expansion card|An add-in circuit board that extends a computer's capabilities through a compatible slot.
`);
group('lesson-1','Ports and cables','Slides 45–51 (image labels)',`
PS/2 port|A round legacy connector used for a keyboard or mouse.
Serial port|A legacy interface that sends data sequentially and is pictured separately from USB and parallel ports.
Parallel port|The legacy 25-pin connector shown for older printers.
USB (Universal Serial Bus)|A standard interface for connecting peripherals and carrying data and power.
USB 2.0|The USB generation labeled 480 Mb/s in the rear-panel diagram.
USB 3.0|The USB generation labeled 5 Gb/s in the rear-panel diagram.
USB 3.1|The label used for the pictured 10 Gb/s USB ports; connector shape and supported speed must be checked separately.
USB Type-A|The familiar rectangular USB connector pictured on several rear-panel ports.
USB Type-B|The squarer USB connector illustrated in the cable guide, commonly found on peripherals such as printers.
USB Type-C|The small reversible USB connector; its shape alone does not guarantee a particular data rate or video capability.
Mini USB|The older small USB connector pictured separately from Micro USB.
Micro USB|The thin small USB connector pictured separately from Mini USB and Type-C.
IEEE 1394 / FireWire|The legacy serial peripheral interface labeled both IEEE 1394 and FireWire on the rear-panel images.
eSATA|An external version of the SATA storage interface pictured on the rear panel.
VGA (Video Graphics Array)|The legacy 15-pin analog video connector shown for monitors.
S-Video|A legacy analog video connector shown in four-pin and seven-pin forms.
DVI (Digital Visual Interface)|A display interface whose variants can carry digital video, analog video, or both.
HDMI (High-Definition Multimedia Interface)|A connection used to transmit digital video and audio to displays and related equipment.
DisplayPort|A digital display interface that can carry video and audio.
Thunderbolt|An interface carrying high-speed data and display signals; the older example shown shares the Mini DisplayPort connector shape.
RJ-45 Ethernet port|The network socket shown for a wired Ethernet cable, commonly called an RJ-45 port.
Gigabit Ethernet|An Ethernet link rate of one billion bits per second.
RJ-11 modem port|The narrower telephone-line socket shown for a dial-up modem.
Modem|A device that adapts data signals to a communication link; the pictured legacy example connects through a telephone line.
S/PDIF (Sony/Philips Digital Interface)|A digital audio interface shown with optical and other digital audio outputs.
Optical audio port|A digital audio connection that sends signals as light through a fiber-optic cable.
Analog audio jack|A connector that carries continuously varying electrical audio signals, shown as the round rear-panel audio sockets.
Line in|An audio input intended for a line-level source such as external audio equipment.
Line out|An audio output used to send line-level sound signals to other equipment.
Microphone jack|An audio input intended for a microphone signal.
Center/subwoofer output|The audio connection labeled for the center speaker and low-frequency speaker in a surround setup.
Rear / side speaker outputs|The separate audio connections shown for surround speakers positioned behind or beside the listener.
Wi-Fi antenna connectors|Rear-panel attachment points for antennas used by the computer's wireless network interface.
`);
group('lesson-2','Administration roles','Slides 3–11, 17–19, 26–29, 34',`
System administration|Managing computer systems and services so users can work reliably and efficiently.
System administrator (sysadmin)|The person responsible for configuring, maintaining, securing, and supporting computer systems.
Administrator|A person who organizes and manages operations so an organization functions efficiently.
Business administration|Managing business functions such as finance, human resources, marketing, accounting, and operations.
Database administrator (DBA)|The specialist responsible for database availability, integrity, access, backup, and restoration.
Network administrator|The specialist responsible for maintaining network equipment, connectivity, and network access.
Security administrator|The specialist responsible for security controls, policies, protection, and intrusion response.
Server / web administrator|The specialist who maintains servers and web services, including availability, configuration, and site security.
Information Services (IS)|The organizational function mentioned alongside technical support for providing and managing information services.
Information technology (IT)|The use and management of computing and communication systems to process, store, and exchange information.
Technical support|Assistance with users' hardware, software, connectivity, and other computing problems.
Service reliability|The ability of an IT service to continue performing its expected function consistently.
Service quality|How well an IT service meets users' requirements for usable, effective, and dependable operation.
Data integrity|Maintaining the accuracy and consistency of stored data.
Sensitive data|Information that requires protection against unauthorized access or disclosure.
Data set|A collection of related data that can be stored, processed, or analyzed.
Legacy system integration|Connecting an older system with other systems so they can continue exchanging or using data.
`);
group('lesson-2','Operating systems and data tools','Slides 3, 12–13, 22',`
Operating system (OS)|The system software that manages hardware resources and provides services for applications.
Windows|Microsoft's operating-system family used on personal computers and servers.
Linux|An open-source operating-system kernel used in many distributions and devices, modeled on Unix concepts.
macOS / Mac operating system|The operating system used on Apple's Mac computers, named as Mac in the lesson.
UNIX|A family of multiuser, multitasking operating systems associated with portability and the UNIX trademark.
Multiuser system|An operating system that supports multiple users with separate sessions or accounts.
Portability|The ability of software or a system to be adapted to different hardware or operating environments.
SQL (Structured Query Language)|A language for defining, querying, and modifying data in relational databases.
Microsoft SQL Server|Microsoft's relational database management product; it is a database system, not a separate name for the SQL language.
Oracle Database|Oracle's relational database management system, supporting SQL for working with data.
IBM Db2|IBM's database management product named among the DBA technologies in the lesson.
Relational database|A database that represents related information in tables and supports relationships between their records.
Microsoft Access|A desktop database application for organizing, querying, and reporting information.
Microsoft Excel|A spreadsheet application mentioned as a comparison for organizing data, distinct from a database server.
Data analysis|Inspecting, organizing, and interpreting data to draw useful conclusions.
HTML (Hypertext Markup Language)|The markup language that structures content on web pages.
JavaScript|A programming language widely used to add behavior and interactivity to web applications.
`);
group('lesson-2','Networks and access','Slides 3, 17–23, 30–32',`
Router|A network device that forwards traffic between different networks.
Switch|A network device that connects devices and forwards traffic within a local network.
Firewall|A security control that allows or blocks network traffic according to rules.
LAN (Local Area Network)|A network covering a limited area such as a room, building, or campus section.
WAN (Wide Area Network)|A network connecting systems across a broad geographical area.
VPN (Virtual Private Network)|A protected logical connection that gives authorized users or sites private access over another network.
SAN (Storage Area Network)|A dedicated network providing servers access to shared storage resources.
Network file system|A system allowing users or computers to access files stored on another machine over a network.
Access control|Rules and mechanisms that determine who can access a resource and what they may do.
User account|A system identity used to associate a person or service with permissions and settings.
Permission|An authorization to perform a particular action on a resource.
Physical security|Protecting equipment and facilities against unauthorized physical access or damage.
Network configuration|Settings that determine how network devices and connections operate.
Identity management|Managing digital identities and their access throughout their use in an organization.
Vulnerability assessment|A systematic examination for weaknesses that could be exploited in a system.
Network intrusion detection|Monitoring network activity for signs of attacks or unauthorized behavior.
Host intrusion detection|Monitoring activity on an individual computer for signs of compromise.
Risk management|Identifying, evaluating, and addressing threats and their possible impacts.
`);
group('lesson-2','Security and web operations','Slides 28–38',`
Cyberattack|An intentional attempt to compromise computer systems, data, or services.
Ransomware|Malicious software that blocks access to systems or data and demands payment.
Malware|Software designed to damage, disrupt, spy on, or otherwise compromise systems.
Anti-malware|Software or controls used to detect, prevent, and remove malicious software.
Security policy|An organization's rules governing protection and acceptable use of its systems and information.
Security compliance|Meeting applicable security requirements, regulations, and organizational policies.
Intrusion response|Actions taken to investigate, contain, and recover from unauthorized system activity.
Data breach|An incident involving unauthorized access to or disclosure of protected information.
Site blocking|Restricting access to selected websites as part of a security or acceptable-use policy.
Phishing|Deceptive messages or websites that trick people into revealing information or taking harmful actions.
Bot|A software agent that performs tasks automatically; malicious bots can be used to attack websites.
Brute-force password attack|Repeatedly trying possible passwords in an attempt to gain unauthorized access.
Apache HTTP Server|Web-server software named in the lesson for serving websites.
IIS (Internet Information Services)|Microsoft's web-server platform named alongside Apache.
Web server|Software or a computer providing web content and services to clients.
Website hosting|Making a website's pages and services available through a server.
Automated deployment|Using automated steps to install or release application changes into an environment.
Blog|A website or section of a website publishing posts, mentioned as an application a web administrator may support.
Scheduling application|Software used to organize appointments, tasks, or planned activities.
Social media management|Using tools and processes to manage posts and activity on social platforms.
`);
group('lesson-2','Professional skills and daily duties','Slides 14–15, 23, 31–32, 39–44',`
Analytical skills|The ability to examine evidence and relationships to understand problems and make decisions.
Business-focused decision making|Choosing technology and staffing approaches that address organizational needs and costs.
Communication skills|Explaining technical information clearly to colleagues, users, suppliers, and management.
Problem solving|Identifying possible causes, testing them, and eliminating causes until an issue can be resolved.
Organizational skills|Arranging data, reports, tasks, and responsibilities so work can be completed effectively.
Critical thinking|Evaluating evidence and assumptions before choosing an explanation or action.
Continuous learning|Regularly updating knowledge as technologies and threats change.
Stress management|Remaining calm and effective when handling urgent or difficult incidents.
Soft skills|Interpersonal and behavioral abilities such as communication, teamwork, and calm decision making.
Hard skills|Technical abilities such as database administration, network configuration, and vulnerability assessment.
Project management|Planning and coordinating tasks, time, and resources to achieve a defined objective.
Teamwork|Working cooperatively with others to achieve a shared objective.
Active listening|Paying attention to another person's message and confirming understanding before responding.
Web design|Planning a website's visual presentation and usability.
Coaching and mentoring|Helping other people develop their skills through guidance, feedback, and support.
Troubleshooting|Investigating a technical problem systematically to identify and resolve its cause.
Backup|A retained copy of data used to recover from loss, corruption, or another incident.
Restore|Recovering data or a system from a saved backup.
Software update|A newer software release or fix installed to improve function, compatibility, or security.
Installation|Placing software or hardware into a system so it can be used.
Configuration|Setting options and parameters so a system meets its intended requirements.
Password reset|Replacing an account's password through an authorized recovery or administration process.
Documentation|Written records of setup, procedures, changes, and troubleshooting information.
Uptime|The time during which a system or service remains operational and available.
Help desk technician|A support role that receives and helps resolve users' computing problems.
IT support specialist|A role providing technical assistance for an organization's computer systems and users.
Network analyst|A role that examines network needs, performance, and problems to support improvements.
Computer systems analyst|A role that evaluates organizational requirements and how computer systems can meet them.
`);
group('lesson-3','Principles and the human role','Slides 4–12, including slide 6 diagram',`
Human-computer system|A working environment made up of people and computing technology that must be managed together.
User support|Helping people use systems effectively and resolve problems that affect their work.
Preventive maintenance|Proactive work intended to reduce the chance of future faults or disruption.
System diagnosis|Investigating symptoms and evidence to determine what is wrong with a system.
System repair|Correcting a faulty component or configuration to restore expected operation.
Physical operating environment|The power, temperature, and physical conditions needed for reliable computing.
Standards|Agreed specifications or practices that help systems operate consistently and compatibly.
Patience|Allowing time to understand users and difficult problems without rushing to unsupported conclusions.
Experience|Practical knowledge gained by working with systems and previous problems.
Logical network design|Organizing network structure and services so they meet requirements efficiently.
Upgradeability|The ability to expand or improve a system as requirements change.
Service provision|Making computing capabilities available to the users who need them.
User productivity|Users' ability to complete useful work effectively with the provided systems.
Community responsibility|Considering the effects of administration on the wider network community as well as individual users.
Interdependence|The way one system or service relies on others, making its changes or failures affect them.
Data flow|The movement of information between components, computers, or services.
System planning|Designing and preparing a computing environment to meet future operational needs.
Equipment maintenance|Keeping hardware and supporting equipment in working condition through inspection and upkeep.
`);
group('lesson-3','Computer ethics','Slides 13–17',`
Computer ethics|Principles governing responsible computer use and its effects on people and society.
Do not harm others|The ethical rule against using a computer to cause injury or damage to other people.
Do not interfere with others' work|The ethical rule against disrupting someone else's computing activities.
Respect file privacy|The ethical rule against snooping through other people's files without permission.
Do not steal|The ethical rule against using computers to take property or resources that are not yours.
Do not bear false witness|The ethical rule against using computers to spread false statements or dishonest evidence.
Respect software licensing|Use and copy software only as its license permits; legally free and open-source software can be used under their terms.
Obtain resource authorization|Use other people's computing resources only with appropriate permission or compensation where required.
Respect intellectual output|Do not claim another person's creative or intellectual work as your own.
Consider social consequences|Think about how a program or system design may affect other people and society.
Show consideration and respect|Use computers in ways that respect the dignity and needs of other people.
`);
group('lesson-3','Operational challenges','Slides 18–20',`
System complexity|The difficulty arising from many interacting components, users, and dependencies.
Software bug|A defect in software that can produce incorrect or unexpected behavior.
Emergent behavior|Unexpected system behavior arising from interactions among components rather than one planned feature.
Workaround|An alternative way to continue work while an underlying problem remains unresolved.
Quality control|Checking that products or changes meet expected standards before or during use.
Operating-system subsystem|A component of an operating system responsible for a particular group of functions.
Software incompatibility|A situation where software components cannot work together correctly.
Interference between programs|One program adversely affecting another through shared resources or conflicting behavior.
Cosmic-ray error|A possible hardware data error caused by energetic particles, listed among unusual sources of system faults.
Computer virus|Malicious code that spreads by attaching to other files or programs.
Creative troubleshooting|Adapting knowledge and testing alternative approaches when routine solutions do not resolve a problem.
`);
group('diagnostics','Diagnostics and evidence','Pages 3–8',`
Diagnostics|Investigating symptoms, components, and conditions to determine the cause of a system problem.
Symptom|An observable sign of a problem, such as an inaccessible website or slow response.
Problem identification|Defining what is wrong and which service or users are affected before investigating causes.
Information collection|Gathering relevant logs, reports, measurements, and configuration details about a problem.
Evidence analysis|Examining collected information to narrow down possible causes.
Root cause|The underlying condition responsible for a problem, distinguished from its visible symptoms.
Solution application|Implementing a corrective action after identifying the likely cause.
Result verification|Checking that a corrective action actually restored the required behavior.
System log|A chronological record of system events used to investigate behavior and errors.
Error message|A reported warning or failure description that provides a clue during investigation.
Monitoring tool|Software used to observe the health, availability, or performance of systems.
Network status|Information about whether connections and network services are operating correctly.
Performance statistics|Measurements such as response time or resource use that help identify bottlenecks.
Configuration record|A record of settings that helps compare expected and actual system behavior.
User report|A description from an affected user of what happened and under what conditions.
Database connectivity|The ability of an application to establish and use its connection to a database.
Storage capacity|The amount of data a storage system can hold; exhausted capacity can cause application failure.
Recent activity review|Checking recent operations and changes for events related to the start of a problem.
`);
group('diagnostics','Fault management','Pages 9–14',`
Fault|An underlying defect or condition capable of causing a system to malfunction.
Failure|The loss of an expected system function resulting from a fault.
Fault management|Detecting, isolating, diagnosing, correcting, and monitoring faults to restore service and limit disruption.
Fault detection|Recognizing that an abnormal condition or service problem exists.
Fault isolation|Narrowing the problem to the affected component or part of a system.
Fault diagnosis|Determining why the isolated problem occurred.
Fault correction|Repairing or removing the identified cause of a malfunction.
Service restoration|Returning an affected service to usable operation after disruption.
Post-repair monitoring|Continuing observation after repair to confirm stability and detect recurrence.
Temporary fix|An immediate measure that restores service without necessarily preventing the fault from returning.
Long-term solution|A corrective improvement intended to address the cause and prevent recurring problems.
Recurring fault|A problem that repeatedly returns and requires investigation beyond a one-time repair.
Temporary file|Short-lived data that may consume storage and should be removed only when safe and no longer needed.
Restart|Stopping and starting a service or system as a possible recovery measure.
Database corruption|Damage or inconsistency in stored database information that prevents correct use.
Misconfiguration|An incorrect system setting that can cause a fault or unsafe behavior.
Automated monitoring|Regular system checks performed by software to detect developing issues without constant manual inspection.
Capacity expansion|Increasing available resources, such as database storage, to meet demand and prevent exhaustion.
`);
group('diagnostics','Change management','Pages 15–26',`
Change management|Controlling system modifications through assessment, authorization, planning, implementation, and review.
Change request|A proposal describing a needed modification and the reason for it.
Impact assessment|Examining which users, applications, and services a proposed change may affect.
Risk assessment|Evaluating what could go wrong during a change and how serious the consequences would be.
Change approval|Authorization by the appropriate responsible party before a planned change proceeds.
Change planning|Preparing the steps, timing, responsibilities, and recovery arrangements for a modification.
Change implementation|Carrying out the approved modification according to its plan.
Change testing|Checking that the modified system works correctly and does not introduce unacceptable effects.
Change review|Evaluating the outcome after implementation and recording lessons or follow-up work.
Standard change|A routine, well-understood modification performed using an established procedure.
Normal change|A modification requiring the usual assessment and authorization process.
Emergency change|An urgent modification needed to address a critical situation where waiting creates greater risk.
Compatibility check|Checking whether the proposed modification will work with the existing environment.
Recovery plan|Prepared steps to restore operation if a change fails or causes an unacceptable problem.
Maintenance schedule|The chosen timing for system work, planned to manage disruption and coordinate resources.
Pre-change backup|A recoverable copy made before a modification to help protect against data loss.
Change documentation|Records of the request, decisions, steps, testing, and outcome of a system modification.
Incident lifecycle|The combined sequence of investigating a problem, restoring service, improving the system, and verifying the outcome.
`);
group('communities','Networked community structure','Pages 3–7, 12–13',`
Networked community|People, devices, systems, and services connected through networks to communicate and share resources.
User|A person who accesses and uses a community's services and resources.
Device|A computer, phone, or other connection point through which a user accesses the network.
Network|The transmission paths and equipment connecting devices so information can move between them.
Server|A system that provides processing, data, or services to other systems.
Cloud|Remotely provided computing resources and services accessed over a network.
Service|A useful capability delivered to users, such as email, web access, or file storage.
Resource|An item or capability shared through a network, such as a printer, file, or application.
Educational networked community|A connected environment supporting students, teachers, and learning activities.
Business networked community|A connected environment supporting employees, operations, and company collaboration.
Government networked community|A connected environment supporting public agencies and their information or services.
Online community|A group that interacts through internet platforms such as forums, social media, or games.
Cloud-based community|A group using shared applications and data hosted through cloud services.
University network|The connected campus environment serving students, faculty, staff, labs, and shared services.
Corporate network|An organization's connected environment for business users, systems, and resources.
Online learning platform|A network service used to provide educational content and learning activities remotely.
Discussion forum|An online space where people exchange messages organized into topics or threads.
Gaming community|People connecting and interacting through networked games and related platforms.
`);
group('communities','Characteristics and shared resources','Pages 8–11, 14–15',`
Connectivity|The ability of devices and systems to establish network connections.
Communication|Exchanging information through network services such as messaging, email, or calls.
Resource sharing|Allowing multiple authorized users to use common files, printers, applications, or storage.
Collaboration|People working together on shared tasks or information through connected tools.
Centralized management|Controlling shared systems and policies from a common administration point.
Decentralized management|Distributing control and management among multiple parts of a community.
Accessibility|The ability of authorized users to reach services from supported devices and locations.
Scalability|The ability of a networked environment to accommodate more users, devices, or workload.
Email|A service for sending and receiving electronic messages between addresses.
Instant messaging|A service for exchanging short messages interactively over a network.
Video conferencing|Real-time communication using video and audio between connected participants.
Shared file|A digital document or other file made accessible to multiple authorized users.
Shared printer|A printer made available for use by multiple devices over a network.
Shared application|Software made available to multiple users through a common environment or service.
Cloud storage|A service that stores files or data on remote systems accessed through a network.
Database|An organized collection of data used by applications and authorized users.
Ethernet|A wired networking technology used to connect devices through cables.
Wi-Fi|Wireless networking used to connect devices within the coverage of a wireless network.
Mobile data|Network connectivity delivered through a cellular provider rather than a local wired connection.
4G|The fourth generation of mobile network technology named in the materials.
5G|The fifth generation of mobile network technology named alongside 4G.
VPN access|An authorized private connection used to reach protected resources from another network.
Remote access|Using network connectivity to reach systems or resources from another location.
`);
group('communities','Challenges and administrator duties','Pages 16–24',`
Network downtime|A period when network connectivity or required network services are unavailable.
Slow network performance|Delayed communication or access that requires investigation of traffic, devices, and configuration.
Security threat|A potential cause of unauthorized access, damage, disruption, or data compromise.
Data privacy|Protecting personal or sensitive information from inappropriate use or exposure.
Connectivity dependence|Reliance on a functioning connection to access networked resources.
Hardware failure|A physical device malfunction that can interrupt shared services.
Software failure|An application or system program malfunction that prevents expected operation.
Unauthorized access|Use of an account or resource without the required permission.
Account isolation|Restricting a suspected compromised account while investigating unauthorized activity.
Device isolation|Disconnecting or restricting a potentially compromised device to limit harm to the network.
Security patch|A software fix installed to address a vulnerability.
Data loss|The disappearance or destruction of information, potentially requiring restoration from backup.
Backup recovery|Restoring needed data or services from a retained backup after an incident.
Network traffic monitoring|Observing communication activity to understand load, performance, and potential problems.
Account management|Creating, modifying, disabling, and maintaining user identities and their access.
Role|A grouping of responsibilities used to determine appropriate access permissions.
Student access|Campus permissions for learning services, Wi-Fi, and authorized computer-lab resources.
Faculty access|Campus permissions for teaching resources, shared academic information, and authorized records.
Staff access|Campus permissions for administrative applications and internal services.
Computer laboratory|A shared computing facility with controlled software, internet access, and user permissions.
LMS (Learning Management System)|A platform for organizing course content, activities, and learning access.
Server and cloud administration|Managing the systems that host a community's data, applications, and shared services.
`);

// Additional terms visible in the source text or diagram legends. Append new
// groups here so previously published per-lesson identifiers remain stable.
group('lesson-1','Interface units and expansion','Slides 37, 47, 50–52',`
PCIe (PCI Express)|A high-speed expansion interconnect used by compatible graphics cards and other devices; its power plugs are shown in the cable diagram.
Megabits per second (Mb/s)|A transfer-rate unit equal to one million bits per second, shown for USB 2.0 in the rear-panel image.
Gigabits per second (Gb/s)|A transfer-rate unit equal to one billion bits per second, shown for USB and Ethernet links.
Audio plug|A cable connector that mates with an audio jack to carry a sound signal.
`);
group('lesson-2','System foundations','Slides 3, 11, 14, 41–43',`
Software|Programs and instructions that run on computer hardware.
Application|Software that helps a user perform a task, such as managing records or browsing the web.
Programming language|A formal language used to express instructions in computer programs.
Computer security|Protecting computer systems and information against unauthorized access, damage, or disruption.
System inspection|Checking hardware, software, and operating conditions for issues requiring maintenance.
Cost effectiveness|Achieving the required benefit while making sensible use of available money and resources.
Infrastructure|The underlying hardware, software, and network resources supporting services.
Account lifecycle|The creation, modification, and removal of user accounts as access needs change.
`);

export function addTerms(content){
  const counters={};
  for(const g of termGroups){
    const lesson=content.lessons.find(l=>l.id===g.lessonId);lesson.terms??=[];
    for(const [term,definition] of g.rows){
      if(!term||!definition)throw new Error('Incomplete term in '+g.topic);
      const number=counters[g.lessonId]=(counters[g.lessonId]||0)+1;
      const id=`${g.lessonId}-term-${number}`;
      lesson.terms.push({id,term,definition,topic:g.topic,ref:g.ref});
      lesson.flashcards.push({front:term,back:definition,ref:g.ref,termId:id});
      const peers=g.rows.filter(r=>r[0]!==term).map(r=>r[0]);
      // Rotate distractors within the same topic; option order is randomized per attempt.
      const offset=(number*7)%peers.length;
      const wrong=Array.from({length:3},(_,i)=>peers[(offset+i)%peers.length]);
      content.questions.push({id:`${g.lessonId}-vocab-${number}`,lessonId:g.lessonId,termId:id,topic:g.topic,prompt:`Which term matches this description?\n\n${definition}`,options:[term,...wrong],answer:0,explanation:`${term}: ${definition}`,ref:g.ref,difficulty:'foundation'});
    }
  }
  return content;
}
