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
		'0x996b39698CF96A70B7a7005B5d1924a66C5E8f0e', // TCO2Faucet
		'0xa5831eb637dff307395b5183c86B04c69C518681', // TCO2Token
		'Footprint',
		'FTP'
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
