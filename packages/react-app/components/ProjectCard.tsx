import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CrowdFundContract from '../abi/abi.json';


const web3 = new Web3("https://celo-alfajores.infura.io/v3/4548163d70964e74b6e82bd5a420f407");

type ProjectDetails = {
  projectCreator: string;
  projectTitle: string;
  projectDescription: string;
  projectImageLink: string;
  fundRaisingDeadline: string;
  currentState: string;
  projectGoalAmount: string;
  currentAmount: string;
};

function ProjectCard(): JSX.Element {
  const [projectCount, setProjectCount] = useState<number>(0);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageLink, setImageLink] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [amountToRaise, setAmountToRaise] = useState<string>('');
  const [accounts, setAccounts] = useState<string[]>([]);

  const crowdFund = new web3.eth.Contract(
    CrowdFundContract.abi as any,
    '0x03615eec1Efb743e2E09f649E6F053FD0e978cE9'
  );
  useEffect(() => {
    const init = async (): Promise<void> => {

      // Fetch user account
      // Fetch user accounts
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      // Fetch project details
      const projectCount = await crowdFund.methods.getProjectCount().call();
      setProjectCount(projectCount)
      const fetchedProjects: ProjectDetails[] = [];
      for (let i = 0; i < projectCount; i++) {
        const projectDetails = await crowdFund.methods.getProjectDetails(i).call();
        fetchedProjects.push(projectDetails);
      }
      setProjects(fetchedProjects);
    };

    init();
  }, []);

  const handleStartProject = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("Creating Project")
    try {
      if (!crowdFund) return;

      await crowdFund.methods.startProject(
        title,
        description,
        imageLink,
        duration,
        amountToRaise
      ).send({ from: accounts[0] });

      // Refresh project details
      const projectCount = await crowdFund.methods.getProjectCount().call();
      const fetchedProjects: ProjectDetails[] = [];
      for (let i = 0; i < projectCount; i++) {
        const projectDetails = await crowdFund.methods.getProjectDetails(i).call();
        fetchedProjects.push(projectDetails);
      }
      setProjects(fetchedProjects);

      // Clear form fields
      setTitle('');
      setDescription('');
      setImageLink('');
      setDuration('');
      setAmountToRaise('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleContribute = async (projectId: number, amount: number): Promise<void> => {
    try {
      if (!crowdFund) return;

      await crowdFund.methods.contribute(projectId, amount).send({ from: accounts[0] });

      // Refresh project details
      const projectCount = await crowdFund.methods.getProjectCount().call();
      const fetchedProjects: ProjectDetails[] = [];
      for (let i = 0; i < projectCount; i++) {
        const projectDetails = await crowdFund.methods.getProjectDetails(i).call();
        fetchedProjects.push(projectDetails);
      }
      setProjects(fetchedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='md:w-[1000px] w-[300px]'>
      <div className='w-80% mx-auto
      '>
      <div className='bg-white my-[50px] rounded-lg p-[40px] justify-center place-content-center '>
        <p className='font-bold text-2xl text-black '>Ready to start a Funding Project?</p>
        <p>Fill the form to get your small business funded</p>
      </div>
      <form className='flex flex-col
       justify-center w-full' onSubmit={handleStartProject}>
        <div>
          <input type="text" className='p-4 my-2 w-full' placeholder='Project Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <input type="text" className='p-4 my-2 w-full' placeholder='Project Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <input type="text" className='p-4 my-2 w-full' placeholder='Project Image Link(Url)' value={imageLink} onChange={(e) => setImageLink(e.target.value)} />
        </div>
        <div>
          <input type="number" className='p-4 my-2 w-full' placeholder='Project Duration  (in days)' value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div>
          <input type="number" className='p-4 my-2 w-full' placeholder='Project Amount To Raise' value={amountToRaise} onChange={(e) => setAmountToRaise(e.target.value)} />
        </div>
        <button className='bg-black text-white p-3 justify-center text-center w-[160px] mx-auto rounded-lg my-2' type="submit">Start Project</button>
      </form>

      <h2 className='my-[30px] font-bold text-2xl text-black '>Available Projects <span>{projectCount}</span></h2>
      {projects.length === 0 ? (
        <div className='bg-white flex justify-center text-center place-content-center flex-col mx-auto md:py-[60px] px-4'>
          <p className='text-2xl font-semibold '>No projects available.</p>
          <div className='text-center justify-center flex'>
          <button className="bg-black p-3 my-3 text-white font-semibold rounded-lg w-[300px]">Fill Form to Create Project</button>
          </div>
        </div>
      ) : (
        projects.map((project, index) => (
          <div className="flex bg-white p-4 rounded-lg font-medium" key={index}>
            <h3>{project.projectTitle}</h3>
            <p>{project.projectDescription}</p>
            <p>Goal Amount: {project.projectGoalAmount}</p>
            <p>Current Amount: {project.currentAmount}</p>
            <p>Raising Deadline: {project.fundRaisingDeadline}</p>
            <button className="bg-black p-3 my-3 text-white font-semibold" onClick={() => handleContribute(index, 10)}>Contribute</button>
          </div>
        ))
      )}
      </div>
    </div>
  );
}

export default ProjectCard;

