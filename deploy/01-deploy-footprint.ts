import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { developmentChains, networkConfig } from '../helper-hardhat-config'
import verify from '../helper-functions'

const deployFootprint: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment
) {
	// @ts-ignore
	const { getNamedAccounts, deployments, network } = hre
	const { deploy, log } = deployments
	const { deployer } = await getNamedAccounts()

	log('----------------------------------------------------')
	log('Deploying Footprint contract and waiting for confirmations...')

	const args: any[] = [
		'0x0b8f280df5ca109e702ea27266adb0705bfacf01',
		'0xb297f730e741a822a426c737ecd0f7877a9a2c22',
		'Green Carbon Calculator',
		'GCC'
	]

	const FootprintContract = await deploy('Footprint', {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: networkConfig[network.name].blockConfirmations || 1
	})
	if (
		!developmentChains.includes(network.name) &&
		(process.env.CELOSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY)
	) {
		await verify(FootprintContract.address, args)
	}
}

export default deployFootprint
deployFootprint.tags = ['all', 'Footprint']
