import { dataService } from './services/dataService'
async function runTests() {
    console.log('🚀 Starting Logical Validation Tests...\n')
    // Test 1: Initial State
    console.log('Test 1: Initial State Check')
    const initialPosts = dataService.getPosts()
    const initialPending = dataService.getPendingApprovals()
    console.log(`- Initial posts: ${initialPosts.length}`)
    console.log(`- Initial pending: ${initialPending.length}`)
    if (initialPending.length !== 1) {
        throw new Error(`Test 1 Failed: Expected 1 pending post, got ${initialPending.length}`)
    }
    console.log('✅ Test 1 Passed\n')
    // Test 2: Approval Flow
    console.log('Test 2: Approval Flow')
    const targetPostId = initialPending[0].id
    console.log(`- Approving post: ${targetPostId}`)
    dataService.updatePostStatus(targetPostId, 'published')
    const postsAfterApproval = dataService.getPosts()
    const pendingAfterApproval = dataService.getPendingApprovals()
    const approvedPost = postsAfterApproval.find((p) => p.id === targetPostId)
    console.log(`- Posts after approval: ${postsAfterApproval.length}`)
    console.log(`- Pending after approval: ${pendingAfterApproval.length}`)
    if (approvedPost?.status !== 'published') {
        throw new Error(`Test 2 Failed: Post status should be 'published', got '${approvedPost?.status}'`)
    }
    if (pendingAfterApproval.length !== 0) {
        throw new Error(`Test 2 Failed: Pending list should be empty, got ${pendingAfterApproval.length}`)
    }
    console.log('✅ Test 2 Passed\n')
    // Test 3: Rejection Flow
    console.log('Test 3: Rejection Flow')
    const testPostId = initialPosts.find((p) => p.status === 'draft')?.id
    if (!testPostId) throw new Error('Test 3 Failed: No draft post found to reject')
    console.log(`- Rejecting post: ${testPostId}`)
    dataService.updatePostStatus(testPostId, 'failed')
    const postAfterRejection = dataService.getPosts().find((p) => p.id === testPostId)
    if (postAfterRejection?.status !== 'failed') {
        throw new Error(`Test 3 Failed: Post status should be 'failed', got '${postAfterRejection?.status}'`)
    }
    console.log('✅ Test 3 Passed\n')
    // Test 4: Activity Log
    console.log('Test 4: Activity Log Consistency')
    const activities = dataService.getActivities()
    console.log(`- Total activities: ${activities.length}`)
    if (activities.length < 3) {
        // 1 initial + 1 approval + 1 rejection
        throw new Error(`Test 4 Failed: Expected at least 3 activities, got ${activities.length}`)
    }
    console.log('✅ Test 4 Passed\n')
    console.log('🎉 ALL LOGICAL TESTS PASSED SUCCESSFULLY!\n')
}
runTests().catch((err) => {
    console.error('❌ TESTS FAILED:')
    console.error(err)
    process.exit(1)
})
