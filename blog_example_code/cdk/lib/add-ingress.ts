import * as ec2 from "aws-cdk-lib/aws-ec2"
import { Construct } from "constructs";

// Helper function to create the roles, since it's very repetitive
export function addIngress(scope: Construct,
    name: string,
    toSecurityGroup: ec2.CfnSecurityGroup | string,
    fromSecurityGroup: ec2.CfnSecurityGroup | string,
    ipProtocol: string,
    reverse: boolean,
    fromPort?: number,
    toPort?: number) {

    if (fromPort === undefined) fromPort = 0
    if (toPort === undefined) toPort = 65535

    const to = toSecurityGroup instanceof ec2.CfnSecurityGroup
        ? toSecurityGroup.ref : toSecurityGroup

    const from = fromSecurityGroup instanceof ec2.CfnSecurityGroup
        ? fromSecurityGroup.ref : fromSecurityGroup

    new ec2.CfnSecurityGroupIngress(scope, name, {
        ipProtocol, fromPort, toPort,
        groupId: to, sourceSecurityGroupId: from,
    })

    if (reverse) {
        // Create the same ingress role in reverse
        new ec2.CfnSecurityGroupIngress(scope, name + "-rev", {
            ipProtocol, fromPort, toPort,
            sourceSecurityGroupId: to, groupId: from,
        })
    }
}