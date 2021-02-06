import { network } from "hardhat";
import assert from "assert";

import { sharedBeforeEach } from "../lib/shared-before-each";

const TEST_ACCOUNT = "0x1234567890123456789012345678901234567890";

describe("Testing the helper by transferring some eth", function () {
  describe("No nested describe", function () {
    sharedBeforeEach(network.provider, async function () {
      await send1WeiToTestAccount();
    });

    testWithNWei(1);
  });

  describe("With a nested describe", function () {
    sharedBeforeEach(
      "Optional title, like in beforeEach. Helpful for debugging",
      network.provider,
      async function () {
        await send1WeiToTestAccount();
      }
    );

    describe("With two weis", function () {
      sharedBeforeEach(network.provider, async function () {
        await send1WeiToTestAccount();
        throw new Error();
      });

      testWithNWei(2);

      describe("With three weis", function () {
        sharedBeforeEach(network.provider, async function () {
          await send1WeiToTestAccount();
        });

        testWithNWei(3);
      });

      testWithNWei(2);
    });

    testWithNWei(1);
  });
});

describe("Unrelated describe", function () {
  it("Shouldn't be affected", async function () {
    assert.equal(await getTestAccountBalance(), 0);
  });
});

function testWithNWei(wei: number) {
  it(`Should have ${wei} wei`, async function () {
    assert.equal(await getTestAccountBalance(), wei);
  });

  it(`Should have ${wei} wei and be able to accept another one`, async function () {
    assert.equal(await getTestAccountBalance(), wei);
    await send1WeiToTestAccount();
    assert.equal(await getTestAccountBalance(), wei + 1);
  });

  it(`Should still have ${wei} wei`, async function () {
    assert.equal(await getTestAccountBalance(), wei);
  });
}

async function send1WeiToTestAccount() {
  await network.provider.request({
    method: "eth_sendTransaction",
    params: [{ to: TEST_ACCOUNT, value: "0x1" }],
  });
}

async function getTestAccountBalance(): Promise<number> {
  const b = (await network.provider.request({
    method: "eth_getBalance",
    params: [TEST_ACCOUNT],
  })) as string;

  return parseInt(b.substr(2), 16);
}
